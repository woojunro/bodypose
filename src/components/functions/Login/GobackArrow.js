export const GobackArrow = (hist) => {
  let history = hist;

  if (history.location.state.previousPath === '/concepts') {
    history.goBack();
  } else history.push('/');
};
