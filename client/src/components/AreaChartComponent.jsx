import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const AreaChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 50 }}>
        {/* recharts所定の形式でdataを渡す必要があるため、サーバー側でdataを整えておく必要があった。 */}
        <CartesianGrid strokeDasharray="3, 3" />
        <XAxis dataKey="date" />
        {/* 受け取ったdataのkeyの中からdateを探して、そのvalueをXaxisのデータとして使用する */}
        <YAxis allowDecimals={false} />
        {/* Y軸の表示を整数にしたい場合、decimalをfalseにする。 */}
        <Tooltip />
        <Area type="monotone" dataKey="count" stroke="#2cb1bc" fill="#bef8fd" />
        {/* 受け取ったdataのkeyの中からcountを探して、そのvalueを数値データとして使用する。YAxisではなくAreaに書く。 */}
      </AreaChart>
    </ResponsiveContainer>
  );
};
export default AreaChartComponent;
