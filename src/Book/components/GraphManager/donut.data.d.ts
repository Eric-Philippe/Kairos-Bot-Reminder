export interface DonutData {
  labels: Array<String>;
  datasets: Array<datasets>;
}

interface datasets {
  label: String;
  data: Array<number>;
  backgroundColor: Array<String>;
  hoverOffset: number;
}
/**
 * Type guard for DonutData
 * @param object
 * @returns
 */
export function isDonutData(object: unknown): object is DonutData {
  return (
    "labels" in object &&
    "datasets" in object &&
    Array.isArray(object.labels) &&
    Array.isArray(object.datasets) &&
    object.datasets.every((dataset) => isDataset(dataset))
  );
}

export default DonutData;
