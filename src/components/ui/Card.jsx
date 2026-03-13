import './Card.css';

const Card = ({ children, className = '', hoverable = false, onClick, ...props }) => {
  const baseClass = `card ${hoverable ? 'card-hoverable' : ''} ${className}`;
  
  return (
    <div className={baseClass} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
