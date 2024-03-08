export const GobackArrow = hist => {
  if (hist.location.state?.previousPath) {
    hist.goBack();
  } else {
    hist.push('/');
  }
};
