import { Covariance } from './PrimitiveNodes/Cov'
import { Node } from './Node'
import { Variance} from './PrimitiveNodes/Var'

export const nodes: Node[] = [
    new Variance(),
    new Covariance(),
]