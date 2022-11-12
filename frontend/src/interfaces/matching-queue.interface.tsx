export default interface	MachingQueueInterface {
	queue: string[],
	sendInvit: (receiverId: string) => void
}
