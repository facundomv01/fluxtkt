import { useSelector } from 'react-redux'
import { singletonHook } from 'react-singleton-hook'
import socketEvents from '../../../socketio/socketEventConsts'

const initSocket = (socket, dispatch) => {
  socket.on(socketEvents.NEW_TICKET_CREATED, data => {
    console.log('Nuevo ticket creado!', data)
  })
  return socket
}
const initialSocket = null
export const useSocket = singletonHook(initialSocket, () => {
  const socketInitialized = useSelector(state => state.shared.socketInitialized)
  const socket = useSelector(state => state.shared.socket)
  const dispatch = useSelector(state => state.dispatch)

  if (!socketInitialized) {
    initSocket(socket, dispatch)
    return socket
  }
  return socket

})
