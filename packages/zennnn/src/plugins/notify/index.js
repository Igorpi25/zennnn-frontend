import { createNotify } from './Notify'

const Notify = createNotify()

export default Notify

export const notify = Notify.instance
