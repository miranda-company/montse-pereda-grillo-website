export type EditorialCollection = "notas" | "mediateca" | "portafolio"
export type ConnectionDirection = "outgoing" | "incoming" | "mutual"
export type ConnectionNodeKey = `${EditorialCollection}:${string}`

export interface ConnectionNode {
  key: ConnectionNodeKey
  collection: EditorialCollection
  id: string
  title: string
  href: string
  archiveNumber: string
}

export interface ConnectionEdge {
  source: ConnectionNodeKey
  target: ConnectionNodeKey
}

export interface ResolvedConnection extends ConnectionNode {
  direction: ConnectionDirection
}

export interface ConnectionGroups {
  readonly outgoing: readonly ResolvedConnection[]
  readonly incoming: readonly ResolvedConnection[]
  readonly mutual: readonly ResolvedConnection[]
}

export interface SupplementalConnectionLink {
  title: string
  href: string
  label: string
  target?: "_blank"
  rel?: "noopener noreferrer"
  ariaLabel?: string
  external?: boolean
}

export interface ConnectionGraph {
  get(key: ConnectionNodeKey): ConnectionGroups
}

const collectionOrder = {
  notas: 0,
  mediateca: 1,
  portafolio: 2,
} satisfies Record<EditorialCollection, number>

const EMPTY_CONNECTION_GROUPS: ConnectionGroups = Object.freeze({
  outgoing: Object.freeze([]),
  incoming: Object.freeze([]),
  mutual: Object.freeze([]),
})

export function countConnections(groups: ConnectionGroups, supplementalCount = 0) {
  return groups.mutual.length + groups.outgoing.length + groups.incoming.length + supplementalCount
}

export function createConnectionNodeKey(
  collection: EditorialCollection,
  id: string,
): ConnectionNodeKey {
  return `${collection}:${id}`
}

function compareConnectionNodes(first: ConnectionNode, second: ConnectionNode) {
  return (
    collectionOrder[first.collection] - collectionOrder[second.collection] ||
    first.archiveNumber.localeCompare(second.archiveNumber, "es", { numeric: true }) ||
    first.title.localeCompare(second.title, "es")
  )
}

function addAdjacentNode(
  adjacency: Map<ConnectionNodeKey, Set<ConnectionNodeKey>>,
  key: ConnectionNodeKey,
  adjacentKey: ConnectionNodeKey,
) {
  const existing = adjacency.get(key)
  if (existing) {
    existing.add(adjacentKey)
    return
  }

  adjacency.set(key, new Set([adjacentKey]))
}

function resolveNodes(
  keys: Iterable<ConnectionNodeKey>,
  direction: ConnectionDirection,
  nodes: Map<ConnectionNodeKey, ConnectionNode>,
) {
  return [...keys]
    .map((key) => nodes.get(key))
    .filter((node): node is ConnectionNode => Boolean(node))
    .sort(compareConnectionNodes)
    .map((node): ResolvedConnection => ({ ...node, direction }))
}

export function buildConnectionGraph(
  connectionNodes: readonly ConnectionNode[],
  connectionEdges: readonly ConnectionEdge[],
): ConnectionGraph {
  const nodes = new Map(connectionNodes.map((node) => [node.key, node]))
  const outgoing = new Map<ConnectionNodeKey, Set<ConnectionNodeKey>>()
  const incoming = new Map<ConnectionNodeKey, Set<ConnectionNodeKey>>()

  for (const edge of connectionEdges) {
    if (edge.source === edge.target || !nodes.has(edge.source) || !nodes.has(edge.target)) continue

    addAdjacentNode(outgoing, edge.source, edge.target)
    addAdjacentNode(incoming, edge.target, edge.source)
  }

  return {
    get(key) {
      if (!nodes.has(key)) return EMPTY_CONNECTION_GROUPS

      const outgoingKeys = outgoing.get(key) ?? new Set<ConnectionNodeKey>()
      const incomingKeys = incoming.get(key) ?? new Set<ConnectionNodeKey>()
      const mutualKeys = new Set(
        [...outgoingKeys].filter((candidateKey) => incomingKeys.has(candidateKey)),
      )
      const outgoingOnly = [...outgoingKeys].filter((candidateKey) => !mutualKeys.has(candidateKey))
      const incomingOnly = [...incomingKeys].filter((candidateKey) => !mutualKeys.has(candidateKey))

      return {
        outgoing: resolveNodes(outgoingOnly, "outgoing", nodes),
        incoming: resolveNodes(incomingOnly, "incoming", nodes),
        mutual: resolveNodes(mutualKeys, "mutual", nodes),
      }
    },
  }
}
