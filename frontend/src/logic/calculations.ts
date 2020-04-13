import { Config } from "../redux/state";

const sanLiuConversion = [0,1,2,3,5,10,20,40,80];

const oneDollarConversion = [0,1,2,4,8,16,32,64,128];

function taiToUnitCost(tai: number, config: Config) {
  return config.factor * (config.sanLiu ? sanLiuConversion[tai] : oneDollarConversion[tai]);
}

export function getFeedZiMoCost(tai: number, config: Config) {
  const adjustedTai = Math.min(tai, config.maxTai);
  return taiToUnitCost(adjustedTai + 1, config);
}

export function getCollateralCost(tai: number, config: Config) {
  const adjustedTai = Math.min(tai, config.maxTai);
  return taiToUnitCost(adjustedTai, config);
}