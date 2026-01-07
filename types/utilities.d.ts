type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

type DistributivePick<T, K extends PropertyKey> = T extends unknown ? Pick<T, K> : never;
