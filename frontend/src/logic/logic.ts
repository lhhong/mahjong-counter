import { Config } from "../redux/state";
import { MJEvent, GaEvent, GangEvent, HuEvent } from "../interfaces/mjEvents";
import { Players, Seat } from "../interfaces/players";
import { getCollateralCost, getFeedZiMoCost } from "./calculations";
import { createPlayers } from "../utils/playersUtil";
import { assertNever } from "../utils/generalUtil";

interface CostStructure {
  feedZiMo: number;
  collateral: number;
  gain: number;
}

export function eventToGains(event: MJEvent, config: Config): Players<number> {
  switch (event.event) {
    case "ga":
      return getGaGains(event, config);
    case "gang":
      return getGangGains(event, config);
    case "hu":
      return getHuGains(event, config);
    default:
      return assertNever(event);
  }
}

function getHuGains(event: HuEvent, config: Config): Players<number> {
  if (event.yiPaoSanXiang) {
    return getYiPaoSanXiangGains(event, config);
  } else if (event.zhaHu) {
    return getZhaHuGains(event, config);
  } else {
    const costStructure = getCostStructure(event.tai, event.ziMo, config);
    if (config.shooter && event.feeder !== undefined) {
      return createPlayers(0, [
        { seat: event.target, value: costStructure.gain },
        { seat: event.feeder, value: -costStructure.gain },
      ]);
    } else {
      return getNonShooterGain(costStructure, event.ziMo, event.target, event.feeder);
    }
  }
}

function getYiPaoSanXiangGains(event: HuEvent, config: Config): Players<number> {
  const next1Payout = 4 * getCollateralCost(config.maxTai, config);
  const next2Payout = 4 * getCollateralCost(config.maxTai - 1, config);
  const next3Payout = 4 * getCollateralCost(config.maxTai - 2, config);
  const loss = next1Payout + next2Payout + next3Payout;
  switch (event.target) {
    case Seat.DONG:
      return {
        dong: -loss,
        nan: next1Payout,
        xi: next2Payout,
        bei: next3Payout,
      }
    case Seat.NAN:
      return {
        dong: next3Payout,
        nan: -loss,
        xi: next1Payout,
        bei: next2Payout,
      }
    case Seat.XI:
      return {
        dong: next2Payout,
        nan: next3Payout,
        xi: -loss,
        bei: next1Payout,
      }
    case Seat.BEI:
      return {
        dong: next1Payout,
        nan: next2Payout,
        xi: next3Payout,
        bei: -loss,
      }
    default:
      assertNever(event.target);
  }
}

function getZhaHuGains(event: HuEvent, config: Config): Players<number> {
  const costStructure = getCostStructure(config.maxTai, event.ziMo, config);
  costStructure.collateral = -costStructure.collateral;
  costStructure.feedZiMo = -costStructure.feedZiMo;
  costStructure.gain = -costStructure.gain;
  return getNonShooterGain(costStructure, event.ziMo, event.target, event.feeder);
}

function getCostStructure(tai: number, ziMo: boolean, config: Config): CostStructure {
  const feedZiMoCost = getFeedZiMoCost(tai, config);
  const collateralCost = getCollateralCost(tai, config);
  return {
    feedZiMo: feedZiMoCost,
    collateral: collateralCost,
    gain: ziMo ? 3 * feedZiMoCost : feedZiMoCost + 2 * collateralCost
  }
}

function getNonShooterGain(
  { feedZiMo, collateral, gain }: CostStructure,
  ziMo: boolean,
  gainer: Seat,
  feeder?: Seat,
): Players<number> {
  if (ziMo) {
    return createPlayers(-feedZiMo, [
      { seat: gainer, value: gain },
    ]);
  } else {
    if (feeder === undefined) {
      console.warn("Undefined hu event!");
      return createPlayers(0, []);
    }
    return createPlayers(-collateral, [
      { seat: gainer, value: gain },
      { seat: feeder, value: -feedZiMo },
    ])
  }
}

function getGaGains(event: GaEvent, config: Config): Players<number> {
  let tai = 1;
  if (event.anGa) tai ++;
  if (event.completeSet) tai ++;
  return getEvenSplitGains(event, config, tai);
}

function getGangGains(event: GangEvent, config: Config): Players<number> {
  let tai = 1;
  if (event.anGang) tai ++;
  return getEvenSplitGains(event, config, tai);
}

function getEvenSplitGains(event: MJEvent, config: Config, tai: number): Players<number> {
  const costPerPlayer = getCollateralCost(tai, config);
  const excepts = [{ seat: event.target, value: costPerPlayer }];
  if (config.shooter && event.feeder !== undefined) {
    excepts.push({ seat: event.feeder, value: - costPerPlayer * 3 });
    return createPlayers(0, excepts);
  } else {
    return createPlayers(-costPerPlayer, excepts);
  }
}