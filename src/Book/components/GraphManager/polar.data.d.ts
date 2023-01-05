export interface PolarData {
  labels: Array<String>;
  datasets: Array<datasets>;
}

interface datasets {
  label: String;
  data: Array<number>;
  backgroundColor: Array<String>;
}
/**
 * Type guard for PolarData
 * @param object
 * @returns
 */
export function isPolarData(object: unknown): object is PolarData {
  return (
    "labels" in object &&
    "datasets" in object &&
    Array.isArray(object.labels) &&
    Array.isArray(object.datasets) &&
    object.datasets.every((dataset) => isDataset(dataset))
  );
}

export default PolarData;
