import { Dimensions } from 'react-native';

let window = Dimensions.get('window');
let ratio = (window.width / 375) > 1.5 ? 1.5 : (window.width / 375);

export const height = window.height;
export const width = window.width;
export default ratio;
