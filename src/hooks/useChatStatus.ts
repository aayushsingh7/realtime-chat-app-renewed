import { useRef, useState, useEffect } from "react";

class ChatCursorHeap {
  public heap: any[];
  public nodeMap: Map<string, number>;

  constructor() {
    this.heap = [];
    this.nodeMap = new Map();
  }

  // O(1) - Get the oldest message seen by the group
  getMinSeenId() {
    return this.heap.length > 0 ? this.heap[0].msgId : "MAX_VALUE";
  }

  // O(log N) - Efficiently update a user when they read a message
  updateUser(userId:string, newMsgId:string) {
    const index = this.nodeMap.get(userId);

    if (index !== undefined) {
      // 1. Update existing user
      this.heap[index].msgId = newMsgId;
      // Since messages only go forward (get larger), we only need to sink down
      this.sinkDown(index);
    } else {
      // 2. Add new user
      const node = { userId, msgId: newMsgId };
      this.heap.push(node);
      this.nodeMap.set(userId, this.heap.length - 1);
      this.bubbleUp(this.heap.length - 1);
    }
  }

  // --- INTERNAL HELPERS ---

  bubbleUp(index:number) {
    while (index > 0) {
      const parentIdx = Math.floor((index - 1) / 2);
      if (this.heap[parentIdx].msgId <= this.heap[index].msgId) break;
      this.swap(index, parentIdx);
      index = parentIdx;
    }
  }

  sinkDown(index:number) {
    const length = this.heap.length;
    while (true) {
      let leftIdx = 2 * index + 1;
      let rightIdx = 2 * index + 2;
      let swapIdx = null;

      if (leftIdx < length) {
        if (this.heap[leftIdx].msgId < this.heap[index].msgId) {
          swapIdx = leftIdx;
        }
      }

      if (rightIdx < length) {
        if (
          (swapIdx === null &&
            this.heap[rightIdx].msgId < this.heap[index].msgId) ||
          (swapIdx !== null &&
            this.heap[rightIdx].msgId < this.heap[swapIdx].msgId)
        ) {
          swapIdx = rightIdx;
        }
      }

      if (swapIdx === null) break;
      this.swap(index, swapIdx);
      index = swapIdx;
    }
  }

  swap(i:number, j:number) {
    // Swap in Array
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    // Update Map indices
    this.nodeMap.set(this.heap[i].userId, i);
    this.nodeMap.set(this.heap[j].userId, j);
  }
}

const useChatStatus = (participants: any[]) => {
  const heapRef = useRef(new ChatCursorHeap());
  const [globalMinCursor, setGlobalMinCursor] = useState(
    "000000000000000000000000"
  );

  // const cursorDependencies = participants.map(p => p[1]).join('|');

  useEffect(() => {
    participants.forEach((p:any) => {
      heapRef.current.updateUser(p[0], p[1]);
    });
    setGlobalMinCursor(heapRef.current.getMinSeenId());
  }, [participants]);

  return globalMinCursor;
};

export default useChatStatus;