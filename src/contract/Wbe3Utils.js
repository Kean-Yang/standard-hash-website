import Web3 from 'web3';
import { MetaMask_CONF_URL } from '../constants';

const Wbe3Utils = new Web3(new Web3.providers.HttpProvider(MetaMask_CONF_URL));
export default Wbe3Utils;
