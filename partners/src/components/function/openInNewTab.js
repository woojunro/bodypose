import { CONTACT_BODYPOSE_URL } from '../../constants/urls';

const openInNewTab = (url = '', target = '_blank') => {
  window.open(url, target, 'noopener');
};

export const openBodyposeContact = () => {
  openInNewTab(CONTACT_BODYPOSE_URL, 'contactBodypose');
};

export default openInNewTab;
