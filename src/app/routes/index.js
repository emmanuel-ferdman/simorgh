import article from './article';
import cpsAsset from './cpsAsset';
import frontPage from './frontPage';
import homePage from './homePage';
import liveRadio from './liveRadio';
import mostRead from './mostRead';
import podcast from './podcast';
import onDemandRadio from './onDemandRadio';
import onDemandTV from './onDemandTV';
import topic from './topic';
import error from './error';
import errorNoRouteMatch from './errorNoRouteMatch';

export default [
  article,
  homePage,
  frontPage,
  liveRadio,
  mostRead,
  podcast,
  onDemandRadio,
  onDemandTV,
  topic,
  cpsAsset,
  error,
  errorNoRouteMatch, // When none of the above routes match, it will fall to this.
  // Please ensure that when adding new pages, it is above this element in the array.
];
