import { Link } from "react-router-dom";

const CategoriesFeed = ({sortRoomsByCategory, categories}) => {
  return (
    <div>
      <div>
        <h3>
          <Link onClick={() => sortRoomsByCategory("")}>All</Link>
        </h3>
      </div>
      <div>
        {categories.map((category) => {
          // console.log('category id', category.id);
          return (
            <div key={category.id}>
              <h3>
                <Link onClick={() => sortRoomsByCategory(category.name)}>
                  {category.name}
                </Link>
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesFeed;
