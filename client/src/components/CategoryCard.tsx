import { Category } from '@shared/schema';
import { Link } from 'wouter';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link href={`/store?category=${category.id}`}>
      <div className="bg-secondary hover:bg-secondary/80 rounded-lg p-4 text-center cursor-pointer transition-colors">
        <div className="text-primary text-3xl mb-2">
          <i className={`fas ${category.icon}`}></i>
        </div>
        <h3 className="font-medium">{category.name}</h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
