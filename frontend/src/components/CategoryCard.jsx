export default function CategoryCard({ title, image }) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition duration-300">
        <img src={image} alt={title} className="w-full h-40 object-cover rounded-md" />
        <h3 className="text-lg font-bold mt-2 text-center">{title}</h3>
      </div>
    );
  }
  