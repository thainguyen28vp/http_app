import { BASE_REQUEST } from '@app/config/Constants'
import { AppState } from 'react-native'
import reactotron from 'reactotron-react-native'
import io, { Socket } from 'socket.io-client'

export abstract class SocketHelper {
  public static socket: Socket
  private static currentToken: string

  static handleOnChangeAppState(nextState: string, socket: Socket) {
    if (!!this.socket && !this.socket?.connected) {
      this.socket.connect()
    }
  }

  public static init(token: string) {
    if (!this.socket && this.currentToken != token) {
      this.currentToken = token
      this.socket = io(BASE_REQUEST.SOCKET_URL, {
        auth: { token },
        path: '/socket.io',
        secure: true,
        reconnection: true,
        reconnectionDelay: 500,
        transports: ['websocket'],
      })
      AppState.addEventListener('change', e =>
        this.handleOnChangeAppState(e, this.socket)
      )
    }
  }
}
