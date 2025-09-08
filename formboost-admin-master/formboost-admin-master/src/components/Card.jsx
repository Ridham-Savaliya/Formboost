// eslint-disable-next-line
const Card = ({ title, children }) => {
  return (
    <div className="bg-white p-5 shadow rounded-lg mt-8 ">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="content flex items-center">{children}</div>
    </div>
  );
};

export default Card;
