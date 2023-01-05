export interface BarData {
  labels: Array<String>;
  datasets: Array<datasets>;
}

interface datasets {
  label: String;
  data: Array<number>;
  backgroundColor: Array<String>;
  borderColor: Array<String>;
  borderWidth: number;
}
/**
 * Type guard for BarData
 * @param object
 * @returns
 */
export function isBarData(object: unknown): object is BarData {
  return (
    "labels" in object &&
    "datasets" in object &&
    Array.isArray(object.labels) &&
    Array.isArray(object.datasets) &&
    object.datasets.every((dataset) => isDataset(dataset))
  );
}

export default BarData;
