import SimplePullToRefresh from 'react-simple-pull-to-refresh';
import LoadingIcon from './conceptListScreen/LoadingIcon';

const PullToRefresh = ({ onRefresh, children }) => (
  <SimplePullToRefresh
    onRefresh={onRefresh}
    pullingContent={null}
    refreshingContent={
      <div style={{ marginTop: 20 }}>
        <LoadingIcon />
      </div>
    }
  >
    {children}
  </SimplePullToRefresh>
);

export default PullToRefresh;
