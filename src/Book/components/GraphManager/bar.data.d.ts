export interface BarData {
  labels: Array<string>;
  datasets: Array<datasets>;
}

interface datasets {
  label: string;
  data: Array<number>;
  backgroundColor: Array<string>;
  borderColor: Array<string>;
  borderWidth: number;
}

export default BarData;
