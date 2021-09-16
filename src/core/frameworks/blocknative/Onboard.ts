import Onboard from 'bnc-onboard';
import { API } from 'bnc-onboard/dist/src/interfaces';

import { getConfig } from '@config';
import { getNetworkId } from '@utils';
import { Wallet, Subscriptions, EthereumNetwork, Theme } from '@types';
import { getAddress } from '@ethersproject/address';

export class BlocknativeWalletImpl implements Wallet {
  private onboard?: API;

  private getState() {
    return this.onboard?.getState();
  }

  get selectedAddress() {
    const address = this.getState()?.address;
    return address ? getAddress(address) : undefined;
  }

  get networkVersion() {
    return this.getState()?.network;
  }

  get balance() {
    return this.getState()?.balance;
  }

  get name() {
    return this.getState()?.wallet.name ?? undefined;
  }

  get provider() {
    return this.getState()?.wallet.provider;
  }

  get isCreated(): boolean {
    return !!this.onboard;
  }

  get isConnected(): Promise<boolean> {
    return this.onboard?.walletCheck() ?? Promise.resolve(false);
  }

  public create(ethereumNetwork: EthereumNetwork, subscriptions: Subscriptions, theme?: Theme): boolean {
    const networkId = getNetworkId(ethereumNetwork);
    const { BLOCKNATIVE_KEY, FORTMATIC_KEY, PORTIS_KEY, WEB3_PROVIDER_HTTPS } = getConfig();

    const rpcUrl = WEB3_PROVIDER_HTTPS;
    const appName = 'Yearn Finance';

    const wallets = [
      { walletName: 'detectedwallet' },
      { walletName: 'metamask' },
      {
        walletName: 'walletConnect',
        rpc: {
          1: rpcUrl,
        },
      },
      {
        walletName: 'trezor',
        appUrl: 'https://reactdemo.blocknative.com',
        email: 'aaron@blocknative.com',
        rpcUrl,
      },
      {
        walletName: 'ledger',
        rpcUrl,
      },
      { walletName: 'coinbase' },
      { walletName: 'status' },
      {
        walletName: 'lattice',
        appName,
        rpcUrl,
      },
      { walletName: 'walletLink', rpcUrl },
      {
        walletName: 'portis',
        apiKey: PORTIS_KEY,
      },
      { walletName: 'fortmatic', apiKey: FORTMATIC_KEY },
      { walletName: 'torus' },
      { walletName: 'authereum', disableNotifications: true },
      { walletName: 'trust', rpcUrl },
      { walletName: 'opera' },
      { walletName: 'operaTouch' },
      { walletName: 'imToken', rpcUrl },
      { walletName: 'meetone' },
      { walletName: 'gnosis' },
      {
        walletName: 'keystone',
        rpcUrl,
        appName,
      },
      { walletName: 'liquality' },
      {
        walletName: 'mewwallet',
        rpcUrl,
      },
    ];

    const walletCheck = [
      { checkName: 'derivationPath' },
      { checkName: 'connect' },
      { checkName: 'accounts' },
      { checkName: 'network' },
    ];

    this.onboard = Onboard({
      networkId,
      dappId: BLOCKNATIVE_KEY,
      darkMode: theme !== 'light',
      subscriptions,
      walletSelect: {
        wallets,
      },
      walletCheck,
    });

    return !!this.onboard;
  }

  public async connect(args?: any): Promise<boolean> {
    try {
      await this.onboard?.walletSelect(args?.name);
      const valid = await this.onboard?.walletCheck();
      return valid ?? false;
    } catch (error) {
      return false;
    }
  }

  public async changeTheme(theme: Theme) {
    const darkMode = theme !== 'light';
    if (this.onboard) {
      this.onboard.config({ darkMode });
    }
  }
}
