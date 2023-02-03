export interface DonutData {
  labels: Array<string>;
  datasets: Array<datasets>;
}

interface datasets {
  label: string;
  data: Array<number>;
  backgroundColor: Array<string>;
  borderColor: Array<string>;
}

export default DonutData;
