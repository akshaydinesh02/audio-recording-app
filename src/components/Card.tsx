interface ICard {
  title: string;
  details: string;
}

const Card = (props: ICard) => {
  const { title, details } = props;
  return (
    <div className="border-[0.5px] border-gray-700 rounded-xl p-4 flex flex-col bg-gray-900 hover:shadow-xl hover:translate-y-[-4px] transition-transform duration-300 ease-in-out cursor-default">
      <p className="text-header mb-1 font-medium w-full relative">
        <span className="absolute inset-x-0 -bottom-2 h-1 bg-gradient-to-r from-gray-600 to-transparent"></span>
        {title}
      </p>
      <p className="text-body w-full h-full font-light mt-4">{details}</p>
    </div>
  );
};

export default Card;
