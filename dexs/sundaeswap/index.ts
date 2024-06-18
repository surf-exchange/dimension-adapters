import fetchURL from "../../utils/fetchURL";
import { FetchOptions, FetchResultV2, FetchResultVolume, SimpleAdapter } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";
import { getTimestampAtStartOfDayUTC } from "../../utils/date";

const historicalVolumeEndpoint = "https://stats.sundaeswap.finance/api/defillama/v0/global-stats/2100"

interface IVolumeall {
  volumeLovelace: number;
  day: string;
}

const fetch = async ({ createBalances, startOfDay }: FetchOptions): Promise<FetchResultV2> => {
  const dailyVolume = createBalances()
  const dayTimestamp = getTimestampAtStartOfDayUTC(startOfDay);
  const dateStr = new Date(dayTimestamp * 1000).toISOString().split('T')[0];
  const historicalVolume: IVolumeall[] = (await fetchURL(historicalVolumeEndpoint)).response;
  const volume = historicalVolume.find(dayItem => dayItem.day === dateStr)?.volumeLovelace as any
  if (!volume) {
    return {}
  }
  dailyVolume.addGasToken(volume)
  return {
    dailyVolume,
  };
};

const adapter: SimpleAdapter = {
  version: 2,
  adapter: {
    [CHAIN.CARDANO]: {
      fetch,
      start: 1643673600,
    },
  },
};

export default adapter;
