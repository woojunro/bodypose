import { VscLoading } from 'react-icons/vsc';
import './LoadingComponent.css';

const LoadingComponent = () => {
  return (
    <div className="loadingComponentContainer">
      <VscLoading className="loadingComponent" />
    </div>
  );
};

export default LoadingComponent;
