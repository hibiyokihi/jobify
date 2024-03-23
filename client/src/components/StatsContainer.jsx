import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/StatsContainer';
import { StatItem } from '../components';

const StatsContainer = ({ defaultStats }) => {
  const stats = [
    {
      title: 'pending applications',
      count: defaultStats?.pending || 0,
      // ゼロの場合には０が表示されるようにする。サーバー側でも同様のケアをしてるが、念の為フロント側でもケアする。
      icon: <FaSuitcaseRolling />,
      color: '#f59e0b',
      bcg: '#fef3c7',
    },
    {
      title: 'interviews scheduled',
      count: defaultStats?.interview || 0,
      icon: <FaCalendarCheck />,
      color: '#647acb',
      bcg: '#e0e8f9',
    },
    {
      title: 'jobs declined',
      count: defaultStats?.declined || 0,
      icon: <FaBug />,
      color: '#d66a6a',
      bcg: '#ffeeee',
    },
  ];

  return (
    <Wrapper>
      {stats.map((stat) => {
        return (
          <StatItem
            key={stat.title} {...stat}
            // propsの中でオブジェクトをスプレッドすると、key-valueがpropsの形に変換される。
          />
        );
      })}

      {/* stats.map(stat => {
        return <StatItem count={pending} title="pending" icon={FaSuitcaseRolling} />
      }) */}
      {/* <StatItem count={pending} title="pending" icon={FaSuitcaseRolling} />
      <StatItem count={interview} title="interview" icon={FaCalendarCheck} />
      <StatItem count={declined} title="declined" icon={FaBug} /> */}
    </Wrapper>
  );
};
export default StatsContainer;
