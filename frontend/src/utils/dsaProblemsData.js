export const DSA_CATEGORIES = [
  "All",
  "Arrays & Hashing",
  "Two Pointers & Sliding Window",
  "Stack & Queues",
  "Linked Lists",
  "Trees & Graphs",
  "Dynamic Programming",
  "HackerRank Interview Prep",
  "System Design & Greedy"
];

export const DSA_PLATFORMS = [
  "All Platforms",
  "LeetCode",
  "CodeChef",
  "HackerRank",
  "GeeksforGeeks / MNCs"
];

export const DSA_DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

export const DSA_PROBLEMS = [
  // ==========================================
  // ARRAYS & HASHING
  // ==========================================
  {
    id: "two-sum",
    title: "1. Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    platform: "LeetCode Top 75",
    companies: ["Google", "Amazon", "Meta", "Microsoft", "TCS"],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    examples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]" },
      { input: "nums = [3, 3], target = 6", output: "[0, 1]" }
    ],
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expected: "[0, 1]" },
      { input: { nums: [3, 2, 4], target: 6 }, expected: "[1, 2]" },
      { input: { nums: [3, 3], target: 6 }, expected: "[0, 1]" }
    ],
    starterCode: {
      Python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    # Return indices [i, j] such that nums[i] + nums[j] == target
    pass
`,
      JavaScript: `function twoSum(nums, target) {
  // Write your solution here
  // Return indices [i, j] such that nums[i] + nums[j] === target
  return [];
}
`,
      Java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        // Return indices [i, j] such that nums[i] + nums[j] == target
        return new int[]{};
    }
}
`
    },
    solutionCode: {
      Python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # O(N) Time | O(N) Space hash map approach
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      JavaScript: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
      Java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[] { seen.get(complement), i };
            }
            seen.put(nums[i], i);
        }
        return new int[]{};
    }
}`
    },
    optimalComplexity: {
      time: "O(N) single pass hash map lookup",
      space: "O(N) auxiliary space for visited elements",
      pitfalls: "Do not use nested O(N^2) loops; beware of picking the same element twice (e.g. nums[i] + nums[i] == target)."
    }
  },
  {
    id: "best-time-stock",
    title: "121. Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    platform: "LeetCode Top 75",
    companies: ["Amazon", "Citadel", "Meta", "Google", "Infosys"],
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the $i^{\\text{th}}$ day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    examples: [
      { input: "prices = [7, 1, 5, 3, 6, 4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5." },
      { input: "prices = [7, 6, 4, 3, 1]", output: "0", explanation: "In this case, no transactions are done and max profit = 0." }
    ],
    testCases: [
      { input: { prices: [7, 1, 5, 3, 6, 4] }, expected: "5" },
      { input: { prices: [7, 6, 4, 3, 1] }, expected: "0" }
    ],
    starterCode: {
      Python: `def maxProfit(prices: list[int]) -> int:
    # Write your solution here
    # Track min price seen so far and max profit attainable
    pass
`,
      JavaScript: `function maxProfit(prices) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your solution here
        return 0;
    }
}
`
    },
    solutionCode: {
      Python: `def maxProfit(prices: list[int]) -> int:
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit`,
      JavaScript: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  for (const price of prices) {
    if (price < minPrice) {
      minPrice = price;
    } else if (price - minPrice > maxProfit) {
      maxProfit = price - minPrice;
    }
  }
  return maxProfit;
}`,
      Java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else if (price - minPrice > maxProfit) {
                maxProfit = price - minPrice;
            }
        }
        return maxProfit;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) single pass",
      space: "O(1) constant memory",
      pitfalls: "Do not compare every pair with O(N^2) loops; you cannot sell on day i before buying on day j."
    }
  },
  {
    id: "product-except-self",
    title: "238. Product of Array Except Self",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    platform: "LeetCode Top 75",
    companies: ["Amazon", "Meta", "Apple", "Microsoft", "Uber"],
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

The product of any prefix or suffix of \`nums\` is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in $O(N)$ time and without using the division operation.`,
    constraints: [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
      "The product of any prefix or suffix fits in a 32-bit integer."
    ],
    examples: [
      { input: "nums = [1, 2, 3, 4]", output: "[24, 12, 8, 6]" },
      { input: "nums = [-1, 1, 0, -3, 3]", output: "[0, 0, 9, 0, 0]" }
    ],
    testCases: [
      { input: { nums: [1, 2, 3, 4] }, expected: "[24, 12, 8, 6]" },
      { input: { nums: [-1, 1, 0, -3, 3] }, expected: "[0, 0, 9, 0, 0]" }
    ],
    starterCode: {
      Python: `def productExceptSelf(nums: list[int]) -> list[int]:
    # Write your solution here
    # Calculate prefix and suffix products without division
    pass
`,
      JavaScript: `function productExceptSelf(nums) {
  // Write your solution here
  return [];
}
`,
      Java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        // Write your solution here
        return new int[]{};
    }
}
`
    },
    solutionCode: {
      Python: `def productExceptSelf(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [1] * n
    # Prefix pass
    prefix = 1
    for i in range(n):
        res[i] = prefix
        prefix *= nums[i]
    # Suffix pass
    suffix = 1
    for i in range(n - 1, -1, -1):
        res[i] *= suffix
        suffix *= nums[i]
    return res`,
      JavaScript: `function productExceptSelf(nums) {
  const n = nums.length;
  const res = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    res[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    res[i] *= suffix;
    suffix *= nums[i];
  }
  return res;
}`,
      Java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            res[i] = prefix;
            prefix *= nums[i];
        }
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            res[i] *= suffix;
            suffix *= nums[i];
        }
        return res;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) two linear passes",
      space: "O(1) auxiliary space beyond the output array",
      pitfalls: "Division by zero crashes if zeros exist in nums; using prefix + postfix accumulator avoids division completely."
    }
  },
  {
    id: "group-anagrams",
    title: "49. Group Anagrams",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    platform: "LeetCode Top 75",
    companies: ["Meta", "Amazon", "Uber", "Apple"],
    description: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.`,
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters."
    ],
    examples: [
      { input: 'strs = ["eat", "tea", "tan", "ate", "nat", "bat"]', output: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]' }
    ],
    testCases: [
      { input: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] }, expected: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]' }
    ],
    starterCode: {
      Python: `def groupAnagrams(strs: list[str]) -> list[list[str]]:
    # Write your solution here
    pass
`,
      JavaScript: `function groupAnagrams(strs) {
  // Write your solution here
  return [];
}
`,
      Java: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // Write your solution here
        return new ArrayList<>();
    }
}
`
    },
    solutionCode: {
      Python: `from collections import defaultdict

def groupAnagrams(strs: list[str]) -> list[list[str]]:
    anagram_map = defaultdict(list)
    for s in strs:
        key = "".join(sorted(s))
        anagram_map[key].append(s)
    return list(anagram_map.values())`,
      JavaScript: `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split("").sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return Array.from(map.values());
}`,
      Java: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = String.valueOf(chars);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`
    },
    optimalComplexity: {
      time: "O(N * K log K) where N = words, K = max word length",
      space: "O(N * K) grouping storage",
      pitfalls: "Can optimize to O(N * K) by hashing a 26-element character count tuple as the hash map key."
    }
  },
  {
    id: "kth-largest-element",
    title: "215. Kth Largest Element in an Array",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    platform: "LeetCode Top 75",
    companies: ["Meta", "Amazon", "Microsoft", "Goldman Sachs"],
    description: `Given an integer array \`nums\` and an integer \`k\`, return the $k^{\\text{th}}$ largest element in the array. Can you solve it in $O(N)$ average time?`,
    constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    examples: [{ input: "nums = [3, 2, 1, 5, 6, 4], k = 2", output: "5" }],
    testCases: [{ input: { nums: [3, 2, 1, 5, 6, 4], k: 2 }, expected: "5" }],
    starterCode: {
      Python: `import heapq

def findKthLargest(nums: list[int], k: int) -> int:
    # Write your solution here
    pass
`,
      JavaScript: `function findKthLargest(nums, k) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Write your solution here
        return 0;
    }
}
`
    },
    solutionCode: {
      Python: `import heapq

def findKthLargest(nums: list[int], k: int) -> int:
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]`,
      JavaScript: `function findKthLargest(nums, k) {
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}`,
      Java: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int num : nums) {
            minHeap.offer(num);
            if (minHeap.size() > k) minHeap.poll();
        }
        return minHeap.peek();
    }
}`
    },
    optimalComplexity: {
      time: "O(N log K) min-heap or O(N) average Quickselect",
      space: "O(K) auxiliary heap",
      pitfalls: "Min-heap of size K keeps the K largest numbers, so the root is the Kth largest."
    }
  },
  {
    id: "missing-number",
    title: "268. Missing Number",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    platform: "GeeksforGeeks / MNCs",
    companies: ["TCS", "Infosys", "Wipro", "Amazon", "Microsoft"],
    description: `Given an array \`nums\` containing \`n\` distinct numbers in the range \`[0, n]\`, return the only number in the range that is missing from the array.`,
    constraints: ["n == nums.length", "1 <= n <= 10^4", "0 <= nums[i] <= n", "All the numbers of nums are unique."],
    examples: [
      { input: "nums = [3, 0, 1]", output: "2" },
      { input: "nums = [0, 1]", output: "2" },
      { input: "nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]", output: "8" }
    ],
    testCases: [
      { input: { nums: [3, 0, 1] }, expected: "2" },
      { input: { nums: [9, 6, 4, 2, 3, 5, 7, 0, 1] }, expected: "8" }
    ],
    starterCode: {
      Python: `def missingNumber(nums: list[int]) -> int:
    # Write your solution here (Try Gauss formula sum or XOR)
    pass
`,
      JavaScript: `function missingNumber(nums) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public int missingNumber(int[] nums) {
        // Write your solution here
        return 0;
    }
}
`
    },
    solutionCode: {
      Python: `def missingNumber(nums: list[int]) -> int:
    # Gauss sum formula: n*(n+1)//2
    n = len(nums)
    expected_sum = n * (n + 1) // 2
    return expected_sum - sum(nums)`,
      JavaScript: `function missingNumber(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((acc, curr) => acc + curr, 0);
  return expectedSum - actualSum;
}`,
      Java: `class Solution {
    public int missingNumber(int[] nums) {
        int n = nums.length;
        int expectedSum = n * (n + 1) / 2;
        int actualSum = 0;
        for (int num : nums) actualSum += num;
        return expectedSum - actualSum;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) single pass",
      space: "O(1) constant space",
      pitfalls: "Sum formula can overflow in 32-bit integers if N is very large; XOR avoids overflow."
    }
  },

  // ==========================================
  // HACKERRANK INTERVIEW PREP CLASSICS
  // ==========================================
  {
    id: "sock-merchant",
    title: "Sales by Match (Sock Merchant)",
    difficulty: "Easy",
    category: "HackerRank Interview Prep",
    platform: "HackerRank",
    companies: ["Amazon", "TCS", "Cognizant", "Wipro", "Infosys"],
    description: `There is a large pile of socks that must be paired by color. Given an array of integers representing the color of each sock, determine how many pairs of socks with matching colors there are.

For example, there are \`n = 7\` socks with colors \`ar = [1, 2, 1, 2, 1, 3, 2]\`. There is one pair of color 1 and one of color 2. There are three odd socks left, one of each color. The number of pairs is 2.`,
    constraints: [
      "1 <= n <= 100",
      "1 <= ar[i] <= 100 where 0 <= i < n"
    ],
    examples: [
      { input: "n = 9, ar = [10, 20, 20, 10, 10, 30, 50, 10, 20]", output: "3", explanation: "Pairs formed: (10, 10), (10, 10), (20, 20)." }
    ],
    testCases: [
      { input: { n: 9, ar: [10, 20, 20, 10, 10, 30, 50, 10, 20] }, expected: "3" },
      { input: { n: 7, ar: [1, 2, 1, 2, 1, 3, 2] }, expected: "2" }
    ],
    starterCode: {
      Python: `def sockMerchant(n: int, ar: list[int]) -> int:
    # Write your solution here
    # Return total number of matching pairs
    pass
`,
      JavaScript: `function sockMerchant(n, ar) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public static int sockMerchant(int n, List<Integer> ar) {
        // Write your solution here
        return 0;
    }
}
`
    },
    solutionCode: {
      Python: `def sockMerchant(n: int, ar: list[int]) -> int:
    # Hash Set approach: O(N) Time | O(N) Space
    unpaired = set()
    pairs = 0
    for sock in ar:
        if sock in unpaired:
            pairs += 1
            unpaired.remove(sock)
        else:
            unpaired.add(sock)
    return pairs`,
      JavaScript: `function sockMerchant(n, ar) {
  const unpaired = new Set();
  let pairs = 0;
  for (const sock of ar) {
    if (unpaired.has(sock)) {
      pairs++;
      unpaired.delete(sock);
    } else {
      unpaired.add(sock);
    }
  }
  return pairs;
}`,
      Java: `class Solution {
    public static int sockMerchant(int n, List<Integer> ar) {
        Set<Integer> unpaired = new HashSet<>();
        int pairs = 0;
        for (int sock : ar) {
            if (unpaired.contains(sock)) {
                pairs++;
                unpaired.remove(sock);
            } else {
                unpaired.add(sock);
            }
        }
        return pairs;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) single pass through the array",
      space: "O(U) where U is unique sock colors",
      pitfalls: "A frequency map with integer division sum(count // 2) is also acceptable."
    }
  },
  {
    id: "counting-valleys",
    title: "Counting Valleys",
    difficulty: "Easy",
    category: "HackerRank Interview Prep",
    platform: "HackerRank",
    companies: ["Amazon", "Cognizant", "TCS", "Accenture"],
    description: `An avid hiker keeps meticulous records of their hikes. During the last hike that took exactly \`steps\` steps, for every step it was noted if it was an uphill \`'U'\` or a downhill \`'D'\` step.

Hikes always start and end at sea level (altitude 0).
* A **mountain** is a sequence of consecutive steps above sea level.
* A **valley** is a sequence of consecutive steps below sea level.

Given the sequence of up and down steps during a hike, find and print the number of valleys walked through.`,
    constraints: [
      "2 <= steps <= 10^6",
      "path contains only characters 'U' and 'D'"
    ],
    examples: [
      { input: 'steps = 8, path = "UDDDUDUU"', output: "1", explanation: "The hiker first enters a valley at step 2 and exits back to sea level at step 8. Total valleys = 1." }
    ],
    testCases: [
      { input: { steps: 8, path: "UDDDUDUU" }, expected: "1" },
      { input: { steps: 12, path: "DDUUDDUDUUUD" }, expected: "2" }
    ],
    starterCode: {
      Python: `def countingValleys(steps: int, path: str) -> int:
    # Write your solution here
    # Valley completed when taking step 'U' and altitude reaches 0
    pass
`,
      JavaScript: `function countingValleys(steps, path) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public static int countingValleys(int steps, String path) {
        // Write your solution here
        return 0;
    }
}
`
    },
    solutionCode: {
      Python: `def countingValleys(steps: int, path: str) -> int:
    altitude = 0
    valleys = 0
    for step in path:
        if step == 'U':
            altitude += 1
            if altitude == 0:
                valleys += 1
        else:
            altitude -= 1
    return valleys`,
      JavaScript: `function countingValleys(steps, path) {
  let altitude = 0;
  let valleys = 0;
  for (let i = 0; i < steps; i++) {
    if (path[i] === 'U') {
      altitude++;
      if (altitude === 0) valleys++;
    } else {
      altitude--;
    }
  }
  return valleys;
}`,
      Java: `class Solution {
    public static int countingValleys(int steps, String path) {
        int altitude = 0;
        int valleys = 0;
        for (char c : path.toCharArray()) {
            if (c == 'U') {
                altitude++;
                if (altitude == 0) valleys++;
            } else {
                altitude--;
            }
        }
        return valleys;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) where N is number of steps",
      space: "O(1) tracking altitude counter",
      pitfalls: "Only increment valley count when transitioning from -1 to 0 on an upward step."
    }
  },
  {
    id: "jumping-on-clouds",
    title: "Jumping on the Clouds",
    difficulty: "Easy",
    category: "HackerRank Interview Prep",
    platform: "HackerRank",
    companies: ["Microsoft", "Wipro", "Amazon", "Capgemini"],
    description: `There is a new mobile game that starts with consecutively numbered clouds. Some of the clouds are thunderheads and others are cumulus. The player can jump on any cumulus cloud having a number that is equal to the number of the current cloud plus 1 or 2. The player must avoid the thunderheads (\`c[i] == 1\`).

Determine the minimum number of jumps it will take to jump from the starting position to the last cloud. It is always possible to win the game.`,
    constraints: [
      "2 <= n <= 100",
      "c[i] in {0, 1}",
      "c[0] = c[n-1] = 0"
    ],
    examples: [
      { input: "c = [0, 0, 1, 0, 0, 1, 0]", output: "4", explanation: "Path: 0 -> 1 -> 3 -> 4 -> 6 (4 jumps)." },
      { input: "c = [0, 0, 0, 0, 1, 0]", output: "3", explanation: "Path: 0 -> 2 -> 3 -> 5 (3 jumps)." }
    ],
    testCases: [
      { input: { c: [0, 0, 1, 0, 0, 1, 0] }, expected: "4" },
      { input: { c: [0, 0, 0, 0, 1, 0] }, expected: "3" }
    ],
    starterCode: {
      Python: `def jumpingOnClouds(c: list[int]) -> int:
    # Write your solution here
    # Greedy approach: jump 2 steps whenever safe, else 1 step
    pass
`,
      JavaScript: `function jumpingOnClouds(c) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public static int jumpingOnClouds(List<Integer> c) {
        // Write your solution here
        return 0;
    }
}
`
    },
    solutionCode: {
      Python: `def jumpingOnClouds(c: list[int]) -> int:
    jumps = 0
    i = 0
    n = len(c)
    while i < n - 1:
        # Greedily jump 2 steps if within bounds and not a thundercloud
        if i + 2 < n and c[i + 2] == 0:
            i += 2
        else:
            i += 1
        jumps += 1
    return jumps`,
      JavaScript: `function jumpingOnClouds(c) {
  let jumps = 0;
  let i = 0;
  const n = c.length;
  while (i < n - 1) {
    if (i + 2 < n && c[i + 2] === 0) {
      i += 2;
    } else {
      i += 1;
    }
    jumps++;
  }
  return jumps;
}`,
      Java: `class Solution {
    public static int jumpingOnClouds(List<Integer> c) {
        int jumps = 0;
        int i = 0;
        int n = c.size();
        while (i < n - 1) {
            if (i + 2 < n && c.get(i + 2) == 0) {
                i += 2;
            } else {
                i += 1;
            }
            jumps++;
        }
        return jumps;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) greedy traversal",
      space: "O(1) pointer tracking",
      pitfalls: "Always test jumping 2 steps first before falling back to 1."
    }
  },
  {
    id: "repeated-string",
    title: "Repeated String",
    difficulty: "Easy",
    category: "HackerRank Interview Prep",
    platform: "HackerRank",
    companies: ["Accenture", "TCS", "Infosys", "Amazon"],
    description: `There is a string \`s\` of lowercase English letters that is repeated infinitely many times. Given an integer \`n\`, find and print the number of letter 'a's in the first \`n\` letters of the infinite string.`,
    constraints: [
      "1 <= |s| <= 100",
      "1 <= n <= 10^12"
    ],
    examples: [
      { input: 's = "aba", n = 10', output: "7", explanation: 'The first 10 characters are "abaabaabaa". There are 7 \'a\'s.' }
    ],
    testCases: [
      { input: { s: "aba", n: 10 }, expected: "7" },
      { input: { s: "a", n: 1000000000000 }, expected: "1000000000000" }
    ],
    starterCode: {
      Python: `def repeatedString(s: str, n: int) -> int:
    # Write your solution here
    # Avoid generating the full string; use math (divmod)
    pass
`,
      JavaScript: `function repeatedString(s, n) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public static long repeatedString(String s, long n) {
        // Write your solution here
        return 0;
    }
}
`
    },
    solutionCode: {
      Python: `def repeatedString(s: str, n: int) -> int:
    count_a_in_s = s.count('a')
    full_repeats = n // len(s)
    remainder = n % len(s)
    return (full_repeats * count_a_in_s) + s[:remainder].count('a')`,
      JavaScript: `function repeatedString(s, n) {
  let countA = 0;
  for (const c of s) if (c === 'a') countA++;
  const fullRepeats = Math.floor(n / s.length);
  const remainder = n % s.length;
  let remainderA = 0;
  for (let i = 0; i < remainder; i++) {
    if (s[i] === 'a') remainderA++;
  }
  return fullRepeats * countA + remainderA;
}`,
      Java: `class Solution {
    public static long repeatedString(String s, long n) {
        long countA = 0;
        for (char c : s.toCharArray()) if (c == 'a') countA++;
        long fullRepeats = n / s.length();
        long remainder = n % s.length();
        long remainderA = 0;
        for (int i = 0; i < remainder; i++) {
            if (s.charAt(i) == 'a') remainderA++;
        }
        return fullRepeats * countA + remainderA;
    }
}`
    },
    optimalComplexity: {
      time: "O(|s|) linear in length of initial string",
      space: "O(1) constant memory",
      pitfalls: "n can be up to 10^12. Generating the string in memory causes OutOfMemoryError. Math is mandatory."
    }
  },
  {
    id: "left-rotation",
    title: "Arrays: Left Rotation",
    difficulty: "Easy",
    category: "HackerRank Interview Prep",
    platform: "HackerRank",
    companies: ["Amazon", "TCS", "Capgemini", "Microsoft"],
    description: `A left rotation operation on an array of size \`n\` shifts each of the array's elements 1 unit to the left. Given an integer \`d\`, rotate the array that many steps left and return the result.`,
    constraints: ["1 <= n <= 10^5", "1 <= d <= n", "1 <= a[i] <= 10^6"],
    examples: [{ input: "d = 4, arr = [1, 2, 3, 4, 5]", output: "[5, 1, 2, 3, 4]" }],
    testCases: [{ input: { d: 4, arr: [1, 2, 3, 4, 5] }, expected: "[5, 1, 2, 3, 4]" }],
    starterCode: {
      Python: `def rotLeft(a: list[int], d: int) -> list[int]:
    # Write your solution here
    pass
`,
      JavaScript: `function rotLeft(a, d) {
  // Write your solution here
  return [];
}
`,
      Java: `class Solution {
    public static List<Integer> rotLeft(List<Integer> a, int d) {
        // Write your solution here
        return new ArrayList<>();
    }
}
`
    },
    solutionCode: {
      Python: `def rotLeft(a: list[int], d: int) -> list[int]:
    d = d % len(a)
    return a[d:] + a[:d]`,
      JavaScript: `function rotLeft(a, d) {
  const rot = d % a.length;
  return a.slice(rot).concat(a.slice(0, rot));
}`,
      Java: `class Solution {
    public static List<Integer> rotLeft(List<Integer> a, int d) {
        int n = a.size();
        int rot = d % n;
        List<Integer> res = new ArrayList<>(n);
        for (int i = rot; i < n; i++) res.add(a.get(i));
        for (int i = 0; i < rot; i++) res.add(a.get(i));
        return res;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) slicing",
      space: "O(N) output array or O(1) in-place reversal",
      pitfalls: "Use modulo arithmetic: d = d % n to handle cases where d >= n."
    }
  },
  {
    id: "ransom-note",
    title: "Hash Tables: Ransom Note",
    difficulty: "Easy",
    category: "HackerRank Interview Prep",
    platform: "HackerRank",
    companies: ["Meta", "Google", "Amazon", "Microsoft"],
    description: `Given the words in the magazine and the words in the ransom note, return "Yes" if Harold can replicate his ransom note exactly using whole words from the magazine; otherwise, return "No".

Each word in the magazine can only be used once in the ransom note. Case-sensitive.`,
    constraints: ["1 <= m, n <= 30000", "1 <= word.length <= 5"],
    examples: [
      { input: 'magazine = ["give", "me", "one", "grand", "today", "night"], note = ["give", "one", "grand", "today"]', output: '"Yes"' },
      { input: 'magazine = ["two", "times", "three", "is", "not", "four"], note = ["two", "times", "two", "is", "four"]', output: '"No"' }
    ],
    testCases: [
      { input: { magazine: ["give", "me", "one", "grand", "today", "night"], note: ["give", "one", "grand", "today"] }, expected: '"Yes"' },
      { input: { magazine: ["two", "times", "three", "is", "not", "four"], note: ["two", "times", "two", "is", "four"] }, expected: '"No"' }
    ],
    starterCode: {
      Python: `def checkMagazine(magazine: list[str], note: list[str]) -> str:
    # Write your solution here
    # Return "Yes" or "No"
    pass
`,
      JavaScript: `function checkMagazine(magazine, note) {
  // Write your solution here
  return "No";
}
`,
      Java: `class Solution {
    public static String checkMagazine(List<String> magazine, List<String> note) {
        // Write your solution here
        return "No";
    }
}
`
    },
    solutionCode: {
      Python: `from collections import Counter

def checkMagazine(magazine: list[str], note: list[str]) -> str:
    mag_counts = Counter(magazine)
    for word in note:
        if mag_counts[word] <= 0:
            return "No"
        mag_counts[word] -= 1
    return "Yes"`,
      JavaScript: `function checkMagazine(magazine, note) {
  const map = new Map();
  for (const w of magazine) {
    map.set(w, (map.get(w) || 0) + 1);
  }
  for (const w of note) {
    if (!map.has(w) || map.get(w) <= 0) return "No";
    map.set(w, map.get(w) - 1);
  }
  return "Yes";
}`,
      Java: `class Solution {
    public static String checkMagazine(List<String> magazine, List<String> note) {
        Map<String, Integer> map = new HashMap<>();
        for (String w : magazine) map.put(w, map.getOrDefault(w, 0) + 1);
        for (String w : note) {
            int count = map.getOrDefault(w, 0);
            if (count <= 0) return "No";
            map.put(w, count - 1);
        }
        return "Yes";
    }
}`
    },
    optimalComplexity: {
      time: "O(M + N) where M is magazine size, N is note size",
      space: "O(M) hash table frequency storage",
      pitfalls: "Words are case-sensitive and each word can only be used as many times as it appears in the magazine."
    }
  },

  // ==========================================
  // TWO POINTERS & SLIDING WINDOW
  // ==========================================
  {
    id: "longest-substring",
    title: "3. Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Two Pointers & Sliding Window",
    platform: "LeetCode Top 75",
    companies: ["Amazon", "Meta", "Bloomberg", "Google"],
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
    examples: [{ input: 's = "abcabcbb"', output: "3" }, { input: 's = "bbbbb"', output: "1" }],
    testCases: [{ input: { s: "abcabcbb" }, expected: "3" }, { input: { s: "bbbbb" }, expected: "1" }],
    starterCode: {
      Python: `def lengthOfLongestSubstring(s: str) -> int:
    # Write your solution here
    pass
`,
      JavaScript: `function lengthOfLongestSubstring(s) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your solution here
        return 0;
    }
}
`
    },
    solutionCode: {
      Python: `def lengthOfLongestSubstring(s: str) -> int:
    last_idx = {}
    max_len = left = 0
    for right, char in enumerate(s):
        if char in last_idx and last_idx[char] >= left:
            left = last_idx[char] + 1
        last_idx[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
      JavaScript: `function lengthOfLongestSubstring(s) {
  const map = new Map();
  let maxLen = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) left = map.get(char) + 1;
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      Java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c) && map.get(c) >= left) left = map.get(c) + 1;
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) sliding window",
      space: "O(min(N, alphabet_size)) character map",
      pitfalls: "Only update left = max(left, last_idx[char] + 1) to never move left backward."
    }
  },
  {
    id: "valid-palindrome",
    title: "125. Valid Palindrome",
    difficulty: "Easy",
    category: "Two Pointers & Sliding Window",
    platform: "LeetCode Top 75",
    companies: ["Meta", "Microsoft", "Spotify", "Amazon"],
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    constraints: ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."],
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: "false" }
    ],
    testCases: [
      { input: { s: "A man, a plan, a canal: Panama" }, expected: "true" },
      { input: { s: "race a car" }, expected: "false" }
    ],
    starterCode: {
      Python: `def isPalindrome(s: str) -> bool:
    # Write your solution here (Two pointers, ignore non-alphanumeric)
    pass
`,
      JavaScript: `function isPalindrome(s) {
  // Write your solution here
  return false;
}
`,
      Java: `class Solution {
    public boolean isPalindrome(String s) {
        // Write your solution here
        return false;
    }
}
`
    },
    solutionCode: {
      Python: `def isPalindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`,
      JavaScript: `function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;
  const isAlnum = (c) => /[a-zA-Z0-9]/.test(c);
  while (left < right) {
    while (left < right && !isAlnum(s[left])) left++;
    while (left < right && !isAlnum(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}`,
      Java: `class Solution {
    public boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) return false;
            left++;
            right--;
        }
        return true;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) single pass two pointers",
      space: "O(1) in-place without creating a stripped copy of s",
      pitfalls: "Do not create regex replacements of entire string if memory is constrained."
    }
  },
  {
    id: "3sum",
    title: "15. 3Sum",
    difficulty: "Medium",
    category: "Two Pointers & Sliding Window",
    platform: "LeetCode Top 75",
    companies: ["Meta", "Google", "Amazon", "Microsoft"],
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`. No duplicate triplets.`,
    constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
    examples: [{ input: "nums = [-1, 0, 1, 2, -1, -4]", output: "[[-1, -1, 2], [-1, 0, 1]]" }],
    testCases: [{ input: { nums: [-1, 0, 1, 2, -1, -4] }, expected: "[[-1, -1, 2], [-1, 0, 1]]" }],
    starterCode: {
      Python: `def threeSum(nums: list[int]) -> list[list[int]]:
    # Write your solution here
    pass
`,
      JavaScript: `function threeSum(nums) {
  // Write your solution here
  return [];
}
`,
      Java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
}
`
    },
    solutionCode: {
      Python: `def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    n = len(nums)
    for i in range(n - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, n - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                res.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]: left += 1
                while left < right and nums[right] == nums[right - 1]: right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return res`,
      JavaScript: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        res.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return res;
}`,
      Java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1, right = nums.length - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < 0) left++;
                else right--;
            }
        }
        return res;
    }
}`
    },
    optimalComplexity: {
      time: "O(N^2) sorting O(N log N) + two pointers",
      space: "O(1) auxiliary space",
      pitfalls: "Crucial to skip duplicates for both index i and the two pointers left and right."
    }
  },
  {
    id: "container-with-most-water",
    title: "11. Container With Most Water",
    difficulty: "Medium",
    category: "Two Pointers & Sliding Window",
    platform: "LeetCode Top 75",
    companies: ["Google", "Amazon", "Meta", "Adobe"],
    description: `Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water.`,
    constraints: ["2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
    examples: [{ input: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]", output: "49" }],
    testCases: [{ input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expected: "49" }],
    starterCode: {
      Python: `def maxArea(height: list[int]) -> int:
    # Write your solution here
    pass
`,
      JavaScript: `function maxArea(height) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public int maxArea(int[] height) {
        // Write your solution here
        return 0;
    }
}
`
    },
    solutionCode: {
      Python: `def maxArea(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_w = 0
    while left < right:
        max_w = max(max_w, (right - left) * min(height[left], height[right]))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_w`,
      JavaScript: `function maxArea(height) {
  let left = 0, right = height.length - 1, maxW = 0;
  while (left < right) {
    maxW = Math.max(maxW, (right - left) * Math.min(height[left], height[right]));
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxW;
}`,
      Java: `class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1, maxW = 0;
        while (left < right) {
            maxW = Math.max(maxW, (right - left) * Math.min(height[left], height[right]));
            if (height[left] < height[right]) left++;
            else right--;
        }
        return maxW;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) single scan",
      space: "O(1) constant",
      pitfalls: "Always shift the pointer at the shorter bar to have a chance of finding higher area."
    }
  },
  {
    id: "trapping-rain-water",
    title: "42. Trapping Rain Water",
    difficulty: "Hard",
    category: "Two Pointers & Sliding Window",
    platform: "LeetCode Top 75",
    companies: ["Google", "Amazon", "Goldman Sachs", "Meta"],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    constraints: ["1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
    examples: [{ input: "height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]", output: "6" }],
    testCases: [{ input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, expected: "6" }],
    starterCode: {
      Python: `def trap(height: list[int]) -> int:
    # Write your solution here
    pass
`,
      JavaScript: `function trap(height) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public int trap(int[] height) {
        // Write your solution here
        return 0;
    }
}
`
    },
    solutionCode: {
      Python: `def trap(height: list[int]) -> int:
    if not height: return 0
    left, right = 0, len(height) - 1
    left_max, right_max = height[left], height[right]
    water = 0
    while left < right:
        if left_max < right_max:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]
    return water`,
      JavaScript: `function trap(height) {
  if (!height.length) return 0;
  let left = 0, right = height.length - 1;
  let leftMax = height[left], rightMax = height[right], water = 0;
  while (left < right) {
    if (leftMax < rightMax) {
      left++;
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
    } else {
      right--;
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
    }
  }
  return water;
}`,
      Java: `class Solution {
    public int trap(int[] height) {
        if (height == null || height.length == 0) return 0;
        int left = 0, right = height.length - 1;
        int leftMax = height[left], rightMax = height[right], water = 0;
        while (left < right) {
            if (leftMax < rightMax) {
                left++;
                leftMax = Math.max(leftMax, height[left]);
                water += leftMax - height[left];
            } else {
                right--;
                rightMax = Math.max(rightMax, height[right]);
                water += rightMax - height[right];
            }
        }
        return water;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) single pass",
      space: "O(1) extra space",
      pitfalls: "Water depth is bounded by min(left_max, right_max) - height[i]."
    }
  },

  // ==========================================
  // STACK & QUEUES
  // ==========================================
  {
    id: "valid-parentheses",
    title: "20. Valid Parentheses",
    difficulty: "Easy",
    category: "Stack & Queues",
    platform: "LeetCode Top 75",
    companies: ["Amazon", "Microsoft", "Meta", "Google"],
    description: `Given a string \`s\` containing '(', ')', '{', '}', '[' and ']', determine if the input string is valid.`,
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only."],
    examples: [{ input: 's = "()[]{}"', output: "true" }, { input: 's = "([)]"', output: "false" }],
    testCases: [{ input: { s: "()[]{}" }, expected: "true" }, { input: { s: "([)]" }, expected: "false" }],
    starterCode: {
      Python: `def isValid(s: str) -> bool:
    # Write your solution here
    pass
`,
      JavaScript: `function isValid(s) {
  // Write your solution here
  return false;
}
`,
      Java: `class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        return false;
    }
}
`
    },
    solutionCode: {
      Python: `def isValid(s: str) -> bool:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in pairs:
            if not stack or stack[-1] != pairs[char]: return False
            stack.pop()
        else:
            stack.append(char)
    return len(stack) == 0`,
      JavaScript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const c of s) {
    if (map[c]) {
      if (stack.pop() !== map[c]) return false;
    } else {
      stack.push(c);
    }
  }
  return stack.length === 0;
}`,
      Java: `class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`
    },
    optimalComplexity: {
      time: "O(N) linear",
      space: "O(N) stack",
      pitfalls: "Odd length strings can immediately return false."
    }
  },
  {
    id: "daily-temperatures",
    title: "739. Daily Temperatures",
    difficulty: "Medium",
    category: "Stack & Queues",
    platform: "LeetCode Top 75",
    companies: ["Google", "Amazon", "Meta"],
    description: `Given an array of integers \`temperatures\` represents daily temperatures, return an array \`answer\` such that \`answer[i]\` is the days to wait for a warmer temperature. If none, keep 0.`,
    constraints: ["1 <= temperatures.length <= 10^5", "30 <= temperatures[i] <= 100"],
    examples: [{ input: "temperatures = [73, 74, 75, 71, 69, 72, 76, 73]", output: "[1, 1, 4, 2, 1, 1, 0, 0]" }],
    testCases: [{ input: { temperatures: [73, 74, 75, 71, 69, 72, 76, 73] }, expected: "[1, 1, 4, 2, 1, 1, 0, 0]" }],
    starterCode: {
      Python: `def dailyTemperatures(temperatures: list[int]) -> list[int]:
    # Write your solution here (Monotonic stack holding indices)
    pass
`,
      JavaScript: `function dailyTemperatures(temperatures) {
  // Write your solution here
  return [];
}
`,
      Java: `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        // Write your solution here
        return new int[]{};
    }
}
`
    },
    solutionCode: {
      Python: `def dailyTemperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    ans = [0] * n
    stack = []
    for i, t in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < t:
            prev = stack.pop()
            ans[prev] = i - prev
        stack.append(i)
    return ans`,
      JavaScript: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const ans = new Array(n).fill(0);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const prev = stack.pop();
      ans[prev] = i - prev;
    }
    stack.push(i);
  }
  return ans;
}`,
      Java: `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] ans = new int[n];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temperatures[stack.peek()] < temperatures[i]) {
                int prev = stack.pop();
                ans[prev] = i - prev;
            }
            stack.push(i);
        }
        return ans;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) each index pushed/popped once",
      space: "O(N) stack size",
      pitfalls: "Store indices in the stack rather than values so distances can be computed immediately."
    }
  },
  {
    id: "min-stack",
    title: "155. Min Stack",
    difficulty: "Medium",
    category: "Stack & Queues",
    platform: "LeetCode Top 75",
    companies: ["Bloomberg", "Amazon", "Microsoft", "Goldman Sachs"],
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time $O(1)$.`,
    constraints: ["-2^31 <= val <= 2^31 - 1", "Methods pop, top and getMin operations will always be called on non-empty stacks."],
    examples: [{ input: 'MinStack(); push(-2); push(0); push(-3); getMin(); // -3; pop(); top(); // 0; getMin(); // -2', output: "[-3, 0, -2]" }],
    testCases: [{ input: { operations: ["push(-2)", "push(0)", "push(-3)", "getMin()"] }, expected: "-3" }],
    starterCode: {
      Python: `class MinStack:
    def __init__(self):
        # Write your solution here
        pass

    def push(self, val: int) -> None:
        pass

    def pop(self) -> None:
        pass

    def top(self) -> int:
        return 0

    def getMin(self) -> int:
        return 0
`,
      JavaScript: `class MinStack {
  constructor() {
    // Write your solution here
  }
  push(val) {}
  pop() {}
  top() { return 0; }
  getMin() { return 0; }
}
`,
      Java: `class MinStack {
    public MinStack() {
        // Write your solution here
    }
    public void push(int val) {}
    public void pop() {}
    public int top() { return 0; }
    public int getMin() { return 0; }
}
`
    },
    solutionCode: {
      Python: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        val = min(val, self.min_stack[-1] if self.min_stack else val)
        self.min_stack.append(val)

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]`,
      JavaScript: `class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(val) {
    this.stack.push(val);
    const minVal = this.minStack.length === 0 ? val : Math.min(val, this.minStack[this.minStack.length - 1]);
    this.minStack.push(minVal);
  }
  pop() {
    this.stack.pop();
    this.minStack.pop();
  }
  top() {
    return this.stack[this.stack.length - 1];
  }
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}`,
      Java: `class MinStack {
    private Deque<Integer> stack = new ArrayDeque<>();
    private Deque<Integer> minStack = new ArrayDeque<>();

    public MinStack() {}

    public void push(int val) {
        stack.push(val);
        int currentMin = minStack.isEmpty() ? val : Math.min(val, minStack.peek());
        minStack.push(currentMin);
    }

    public void pop() {
        stack.pop();
        minStack.pop();
    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        return minStack.peek();
    }
}`
    },
    optimalComplexity: {
      time: "O(1) for all operations",
      space: "O(N) for parallel min stack",
      pitfalls: "Make sure minStack pops in sync with main stack."
    }
  },

  // ==========================================
  // LINKED LISTS
  // ==========================================
  {
    id: "reverse-linked-list",
    title: "206. Reverse Linked List",
    difficulty: "Easy",
    category: "Linked Lists",
    platform: "LeetCode Top 75",
    companies: ["Microsoft", "Amazon", "Apple", "Google", "TCS"],
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.`,
    constraints: ["0 <= number of nodes <= 5000", "-5000 <= Node.val <= 5000"],
    examples: [{ input: "head = [1, 2, 3, 4, 5]", output: "[5, 4, 3, 2, 1]" }],
    testCases: [{ input: { head: [1, 2, 3, 4, 5] }, expected: "[5, 4, 3, 2, 1]" }],
    starterCode: {
      Python: `def reverseList(head):
    # Write your solution here
    pass
`,
      JavaScript: `function reverseList(head) {
  // Write your solution here
  return null;
}
`,
      Java: `class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your solution here
        return null;
    }
}
`
    },
    solutionCode: {
      Python: `def reverseList(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
      JavaScript: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }
  return prev;
}`,
      Java: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode nextNode = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextNode;
        }
        return prev;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) iterative pass",
      space: "O(1) in-place pointers",
      pitfalls: "Hold reference to next node before overwriting curr.next."
    }
  },
  {
    id: "merge-two-sorted-lists",
    title: "21. Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked Lists",
    platform: "LeetCode Top 75",
    companies: ["Amazon", "Microsoft", "Apple", "TCS", "Infosys"],
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.`,
    constraints: ["0 <= number of nodes <= 50", "-100 <= Node.val <= 100"],
    examples: [{ input: "list1 = [1, 2, 4], list2 = [1, 3, 4]", output: "[1, 1, 2, 3, 4, 4]" }],
    testCases: [{ input: { list1: [1, 2, 4], list2: [1, 3, 4] }, expected: "[1, 1, 2, 3, 4, 4]" }],
    starterCode: {
      Python: `def mergeTwoLists(list1, list2):
    # Write your solution here (Use dummy head pointer)
    pass
`,
      JavaScript: `function mergeTwoLists(list1, list2) {
  // Write your solution here
  return null;
}
`,
      Java: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Write your solution here
        return null;
    }
}
`
    },
    solutionCode: {
      Python: `def mergeTwoLists(list1, list2):
    dummy = ListNode(0)
    curr = dummy
    while list1 and list2:
        if list1.val < list2.val:
            curr.next = list1
            list1 = list1.next
        else:
            curr.next = list2
            list2 = list2.next
        curr = curr.next
    curr.next = list1 if list1 else list2
    return dummy.next`,
      JavaScript: `function mergeTwoLists(list1, list2) {
  const dummy = { val: 0, next: null };
  let curr = dummy;
  while (list1 && list2) {
    if (list1.val < list2.val) {
      curr.next = list1;
      list1 = list1.next;
    } else {
      curr.next = list2;
      list2 = list2.next;
    }
    curr = curr.next;
  }
  curr.next = list1 || list2;
  return dummy.next;
}`,
      Java: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val < list2.val) {
                curr.next = list1;
                list1 = list1.next;
            } else {
                curr.next = list2;
                list2 = list2.next;
            }
            curr = curr.next;
        }
        curr.next = (list1 != null) ? list1 : list2;
        return dummy.next;
    }
}`
    },
    optimalComplexity: {
      time: "O(N + M) single pass",
      space: "O(1) in-place splicing with dummy node",
      pitfalls: "Remember to append the remaining tail with curr.next = list1 || list2."
    }
  },

  // ==========================================
  // TREES & GRAPHS
  // ==========================================
  {
    id: "invert-binary-tree",
    title: "226. Invert Binary Tree",
    difficulty: "Easy",
    category: "Trees & Graphs",
    platform: "LeetCode Top 75",
    companies: ["Google", "Twitter", "Amazon", "Microsoft"],
    description: `Given the \`root\` of a binary tree, invert the tree, and return its root.`,
    constraints: ["0 <= nodes in tree <= 100", "-100 <= Node.val <= 100"],
    examples: [{ input: "root = [4, 2, 7, 1, 3, 6, 9]", output: "[4, 7, 2, 9, 6, 3, 1]" }],
    testCases: [{ input: { root: [4, 2, 7, 1, 3, 6, 9] }, expected: "[4, 7, 2, 9, 6, 3, 1]" }],
    starterCode: {
      Python: `def invertTree(root):
    # Write your solution here
    pass
`,
      JavaScript: `function invertTree(root) {
  // Write your solution here
  return null;
}
`,
      Java: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        // Write your solution here
        return null;
    }
}
`
    },
    solutionCode: {
      Python: `def invertTree(root):
    if not root: return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root`,
      JavaScript: `function invertTree(root) {
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`,
      Java: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode temp = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(temp);
        return root;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) visits each node once",
      space: "O(H) recursion stack",
      pitfalls: "Hold reference to temporary child before re-assigning."
    }
  },
  {
    id: "level-order-traversal",
    title: "102. Binary Tree Level Order Traversal",
    difficulty: "Medium",
    category: "Trees & Graphs",
    platform: "LeetCode Top 75",
    companies: ["Amazon", "Microsoft", "Meta", "LinkedIn"],
    description: `Given the \`root\` of a binary tree, return the level order traversal of its nodes' values. (BFS level by level).`,
    constraints: ["0 <= nodes <= 2000", "-1000 <= Node.val <= 1000"],
    examples: [{ input: "root = [3, 9, 20, null, null, 15, 7]", output: "[[3], [9, 20], [15, 7]]" }],
    testCases: [{ input: { root: [3, 9, 20, 15, 7] }, expected: "[[3], [9, 20], [15, 7]]" }],
    starterCode: {
      Python: `def levelOrder(root) -> list[list[int]]:
    # Write your solution here (Queue BFS)
    pass
`,
      JavaScript: `function levelOrder(root) {
  // Write your solution here
  return [];
}
`,
      Java: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        // Write your solution here
        return new ArrayList<>();
    }
}
`
    },
    solutionCode: {
      Python: `from collections import deque

def levelOrder(root) -> list[list[int]]:
    if not root: return []
    res, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        res.append(level)
    return res`,
      JavaScript: `function levelOrder(root) {
  if (!root) return [];
  const res = [], queue = [root];
  while (queue.length) {
    const size = queue.length, level = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}`,
      Java: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            res.add(level);
        }
        return res;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) each node visited once",
      space: "O(N) queue memory",
      pitfalls: "Freeze level size len(queue) before popping children."
    }
  },
  {
    id: "number-of-islands",
    title: "200. Number of Islands",
    difficulty: "Medium",
    category: "Trees & Graphs",
    platform: "LeetCode Top 75",
    companies: ["Amazon", "Bloomberg", "Google", "Microsoft"],
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of '1's (land) and '0's (water), return the number of islands.`,
    constraints: ["1 <= m, n <= 300", "grid[i][j] is '0' or '1'."],
    examples: [{ input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: "2" }],
    testCases: [{ input: { grid: [["1", "1", "0"], ["1", "1", "0"], ["0", "0", "1"]] }, expected: "2" }],
    starterCode: {
      Python: `def numIslands(grid: list[list[str]]) -> int:
    # Write your solution here (DFS / BFS sink visited land)
    pass
`,
      JavaScript: `function numIslands(grid) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public int numIslands(char[][] grid) {
        // Write your solution here
        return 0;
    }
}
`
    },
    solutionCode: {
      Python: `def numIslands(grid: list[list[str]]) -> int:
    if not grid: return 0
    rows, cols, count = len(grid), len(grid[0]), 0
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1': return
        grid[r][c] = '0'
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,
      JavaScript: `function numIslands(grid) {
  if (!grid.length) return 0;
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') { count++; dfs(r, c); }
    }
  }
  return count;
}`,
      Java: `class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') { count++; dfs(grid, r, c); }
            }
        }
        return count;
    }
    private void dfs(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c); dfs(grid, r - 1, c); dfs(grid, r, c + 1); dfs(grid, r, c - 1);
    }
}`
    },
    optimalComplexity: {
      time: "O(M * N) every cell visited once",
      space: "O(M * N) recursion depth",
      pitfalls: "Sink '1' -> '0' immediately to avoid cycles."
    }
  },
  {
    id: "course-schedule",
    title: "207. Course Schedule (Topological Sort)",
    difficulty: "Medium",
    category: "Trees & Graphs",
    platform: "LeetCode Top 75",
    companies: ["Google", "Meta", "Twitter", "Amazon"],
    description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [a, b]\` indicates that you must take course \`b\` first if you want to take course \`a\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`. (Cycle detection in directed graph).`,
    constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000"],
    examples: [
      { input: "numCourses = 2, prerequisites = [[1, 0]]", output: "true" },
      { input: "numCourses = 2, prerequisites = [[1, 0], [0, 1]]", output: "false" }
    ],
    testCases: [
      { input: { numCourses: 2, prerequisites: [[1, 0]] }, expected: "true" },
      { input: { numCourses: 2, prerequisites: [[1, 0], [0, 1]] }, expected: "false" }
    ],
    starterCode: {
      Python: `def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    # Write your solution here (Kahn's Algorithm BFS or DFS cycle detection)
    pass
`,
      JavaScript: `function canFinish(numCourses, prerequisites) {
  // Write your solution here
  return false;
}
`,
      Java: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Write your solution here
        return false;
    }
}
`
    },
    solutionCode: {
      Python: `from collections import deque, defaultdict

def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    # Kahn's algorithm (indegree BFS)
    in_degree = [0] * numCourses
    adj = defaultdict(list)
    for dest, src in prerequisites:
        adj[src].append(dest)
        in_degree[dest] += 1
    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
    taken = 0
    while queue:
        node = queue.popleft()
        taken += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return taken == numCourses`,
      JavaScript: `function canFinish(numCourses, prerequisites) {
  const inDegree = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [dest, src] of prerequisites) {
    adj[src].push(dest);
    inDegree[dest]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  let taken = 0;
  while (queue.length) {
    const node = queue.shift();
    taken++;
    for (const next of adj[node]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }
  return taken === numCourses;
}`,
      Java: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        int[] inDegree = new int[numCourses];
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            inDegree[p[0]]++;
        }
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) queue.offer(i);
        }
        int taken = 0;
        while (!queue.isEmpty()) {
            int node = queue.poll();
            taken++;
            for (int neighbor : adj.get(node)) {
                if (--inDegree[neighbor] == 0) queue.offer(neighbor);
            }
        }
        return taken == numCourses;
    }
}`
    },
    optimalComplexity: {
      time: "O(V + E) where V is courses and E is prerequisites",
      space: "O(V + E) adjacency list and in-degree array",
      pitfalls: "A cycle means at least one node's in-degree will never reach zero."
    }
  },

  // ==========================================
  // DYNAMIC PROGRAMMING
  // ==========================================
  {
    id: "climbing-stairs",
    title: "70. Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    platform: "LeetCode Top 75",
    companies: ["Google", "Amazon", "Adobe", "TCS", "Infosys"],
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    constraints: ["1 <= n <= 45"],
    examples: [
      { input: "n = 2", output: "2", explanation: "1 step + 1 step, or 2 steps." },
      { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, or 2+1." }
    ],
    testCases: [{ input: { n: 2 }, expected: "2" }, { input: { n: 3 }, expected: "3" }, { input: { n: 5 }, expected: "8" }],
    starterCode: {
      Python: `def climbStairs(n: int) -> int:
    # Write your solution here (Fibonacci DP)
    pass
`,
      JavaScript: `function climbStairs(n) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public int climbStairs(int n) {
        // Write your solution here
        return 0;
    }
}
`
    },
    solutionCode: {
      Python: `def climbStairs(n: int) -> int:
    if n <= 2: return n
    first, second = 1, 2
    for _ in range(3, n + 1):
        first, second = second, first + second
    return second`,
      JavaScript: `function climbStairs(n) {
  if (n <= 2) return n;
  let first = 1, second = 2;
  for (let i = 3; i <= n; i++) {
    const temp = first + second;
    first = second;
    second = temp;
  }
  return second;
}`,
      Java: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int first = 1, second = 2;
        for (int i = 3; i <= n; i++) {
            int temp = first + second;
            first = second;
            second = temp;
        }
        return second;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) linear",
      space: "O(1) two variables",
      pitfalls: "Do not use unmemoized recursion O(2^N) which leads to Time Limit Exceeded."
    }
  },
  {
    id: "maximum-subarray",
    title: "53. Maximum Subarray (Kadane's Algorithm)",
    difficulty: "Medium",
    category: "Dynamic Programming",
    platform: "LeetCode Top 75",
    companies: ["Microsoft", "LinkedIn", "Amazon", "Apple", "TCS"],
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.`,
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    examples: [{ input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]", output: "6" }],
    testCases: [{ input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: "6" }],
    starterCode: {
      Python: `def maxSubArray(nums: list[int]) -> int:
    # Write your solution here
    pass
`,
      JavaScript: `function maxSubArray(nums) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your solution here
        return 0;
    }
}
`
    },
    solutionCode: {
      Python: `def maxSubArray(nums: list[int]) -> int:
    curr_sum = max_sum = nums[0]
    for num in nums[1:]:
        curr_sum = max(num, curr_sum + num)
        max_sum = max(max_sum, curr_sum)
    return max_sum`,
      JavaScript: `function maxSubArray(nums) {
  let currSum = nums[0], maxSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currSum = Math.max(nums[i], currSum + nums[i]);
    maxSum = Math.max(maxSum, currSum);
  }
  return maxSum;
}`,
      Java: `class Solution {
    public int maxSubArray(int[] nums) {
        int currSum = nums[0], maxSum = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currSum = Math.max(nums[i], currSum + nums[i]);
            maxSum = Math.max(maxSum, currSum);
        }
        return maxSum;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) Kadane's",
      space: "O(1) in-place",
      pitfalls: "Do not initialize max_sum to 0 if all numbers are negative."
    }
  },
  {
    id: "coin-change",
    title: "322. Coin Change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    platform: "LeetCode Top 75",
    companies: ["Amazon", "Airbnb", "Microsoft", "Google"],
    description: `Return the fewest number of coins that you need to make up that amount. If impossible, return -1.`,
    constraints: ["1 <= coins.length <= 12", "0 <= amount <= 10^4"],
    examples: [{ input: "coins = [1, 2, 5], amount = 11", output: "3" }],
    testCases: [{ input: { coins: [1, 2, 5], amount: 11 }, expected: "3" }],
    starterCode: {
      Python: `def coinChange(coins: list[int], amount: int) -> int:
    # Write your solution here
    pass
`,
      JavaScript: `function coinChange(coins, amount) {
  // Write your solution here
  return -1;
}
`,
      Java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your solution here
        return -1;
    }
}
`
    },
    solutionCode: {
      Python: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
      JavaScript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (const c of coins) {
    for (let i = c; i <= amount; i++) {
      dp[i] = Math.min(dp[i], dp[i - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      Java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int c : coins) {
            for (int i = c; i <= amount; i++) {
                dp[i] = Math.min(dp[i], dp[i - c] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`
    },
    optimalComplexity: {
      time: "O(amount * N)",
      space: "O(amount) DP table",
      pitfalls: "Initialize table with infinity to distinguish unreachable values."
    }
  },
  {
    id: "word-break",
    title: "139. Word Break",
    difficulty: "Medium",
    category: "Dynamic Programming",
    platform: "LeetCode Top 75",
    companies: ["Amazon", "Uber", "Meta", "Google"],
    description: `Given a string \`s\` and a dictionary of strings \`wordDict\`, return \`true\` if \`s\` can be segmented into a space-separated sequence of dictionary words.`,
    constraints: ["1 <= s.length <= 300", "1 <= wordDict.length <= 1000"],
    examples: [{ input: 's = "leetcode", wordDict = ["leet", "code"]', output: "true" }],
    testCases: [{ input: { s: "leetcode", wordDict: ["leet", "code"] }, expected: "true" }],
    starterCode: {
      Python: `def wordBreak(s: str, wordDict: list[str]) -> bool:
    # Write your solution here
    pass
`,
      JavaScript: `function wordBreak(s, wordDict) {
  // Write your solution here
  return false;
}
`,
      Java: `class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        // Write your solution here
        return false;
    }
}
`
    },
    solutionCode: {
      Python: `def wordBreak(s: str, wordDict: list[str]) -> bool:
    words = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]`,
      JavaScript: `function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && words.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
      Java: `class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> words = new HashSet<>(wordDict);
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;
        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && words.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[s.length()];
    }
}`
    },
    optimalComplexity: {
      time: "O(N^2 * L) substring lookup",
      space: "O(N) DP array",
      pitfalls: "Use a HashSet for O(1) word membership check."
    }
  },

  // ==========================================
  // SYSTEM DESIGN & GREEDY
  // ==========================================
  {
    id: "lru-cache",
    title: "146. LRU Cache Implementation",
    difficulty: "Medium",
    category: "System Design & Greedy",
    platform: "LeetCode Top 75",
    companies: ["Google", "Stripe", "Meta", "Amazon"],
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with get() and put() in $O(1)$ time.`,
    constraints: ["1 <= capacity <= 3000", "At most 2 * 10^5 calls to get and put."],
    examples: [{ input: "LRUCache(2); put(1, 1); put(2, 2); get(1); put(3, 3); // evicts 2", output: "[null, null, null, 1, null]" }],
    testCases: [{ input: { operations: ["put(1,1)", "put(2,2)", "get(1)"] }, expected: "1" }],
    starterCode: {
      Python: `class LRUCache:
    def __init__(self, capacity: int):
        # Write your solution here
        pass

    def get(self, key: int) -> int:
        return -1

    def put(self, key: int, value: int) -> None:
        pass
`,
      JavaScript: `class LRUCache {
  constructor(capacity) {
    // Write your solution here
  }
  get(key) { return -1; }
  put(key, value) {}
}
`,
      Java: `class LRUCache {
    public LRUCache(int capacity) {
        // Write your solution here
    }
    public int get(int key) { return -1; }
    public void put(int key, int value) {}
}
`
    },
    solutionCode: {
      Python: `class Node:
    def __init__(self, key, val):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}
        self.head, self.tail = Node(0, 0), Node(0, 0)
        self.head.next, self.tail.prev = self.tail, self.head

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._insert(node)
            return node.val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self.cache[key] = node
        self._insert(node)
        if len(self.cache) > self.cap:
            lru = self.head.next
            self._remove(lru)
            del self.cache[lru.key]

    def _remove(self, node):
        prev, nxt = node.prev, node.next
        prev.next, nxt.prev = nxt, prev

    def _insert(self, node):
        prev, nxt = self.tail.prev, self.tail
        prev.next = nxt.prev = node
        node.prev, node.next = prev, nxt`,
      JavaScript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const firstKey = this.map.keys().next().value;
      this.map.delete(firstKey);
    }
  }
}`,
      Java: `class LRUCache {
    private final int capacity;
    private final LinkedHashMap<Integer, Integer> map;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new LinkedHashMap<>(capacity, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
                return size() > capacity;
            }
        };
    }
    public int get(int key) { return map.getOrDefault(key, -1); }
    public void put(int key, int value) { map.put(key, value); }
}`
    },
    optimalComplexity: {
      time: "O(1) for both operations",
      space: "O(capacity)",
      pitfalls: "Dummy head and tail nodes eliminate null pointer edge cases."
    }
  },
  {
    id: "merge-intervals",
    title: "56. Merge Intervals",
    difficulty: "Medium",
    category: "System Design & Greedy",
    platform: "LeetCode Top 75",
    companies: ["Google", "Meta", "Bloomberg", "Amazon"],
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    constraints: ["1 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= start_i <= end_i <= 10^4"],
    examples: [
      { input: "intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]", output: "[[1, 6], [8, 10], [15, 18]]" }
    ],
    testCases: [
      { input: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }, expected: "[[1, 6], [8, 10], [15, 18]]" }
    ],
    starterCode: {
      Python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    # Write your solution here (Sort by start time first)
    pass
`,
      JavaScript: `function merge(intervals) {
  // Write your solution here
  return [];
}
`,
      Java: `class Solution {
    public int[][] merge(int[][] intervals) {
        // Write your solution here
        return new int[][]{};
    }
}
`
    },
    solutionCode: {
      Python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged`,
      JavaScript: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const interval of intervals) {
    if (!merged.length || merged[merged.length - 1][1] < interval[0]) {
      merged.push(interval);
    } else {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], interval[1]);
    }
  }
  return merged;
}`,
      Java: `class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> merged = new ArrayList<>();
        for (int[] interval : intervals) {
            if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < interval[0]) {
                merged.add(interval);
            } else {
                merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], interval[1]);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }
}`
    },
    optimalComplexity: {
      time: "O(N log N) sorting intervals",
      space: "O(N) output storage",
      pitfalls: "Intervals must be sorted by start time before linear sweep."
    }
  },
  {
    id: "search-rotated-array",
    title: "33. Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    platform: "LeetCode Top 75",
    companies: ["Meta", "Google", "Amazon", "Microsoft", "TCS"],
    description: `There is an integer array \`nums\` sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index. Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or -1 if it is not in \`nums\`.

You must write an algorithm with $O(\\log N)$ runtime complexity.`,
    constraints: ["1 <= nums.length <= 5000", "-10^4 <= nums[i], target <= 10^4", "All values of nums are unique."],
    examples: [
      { input: "nums = [4, 5, 6, 7, 0, 1, 2], target = 0", output: "4" },
      { input: "nums = [4, 5, 6, 7, 0, 1, 2], target = 3", output: "-1" }
    ],
    testCases: [
      { input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 0 }, expected: "4" },
      { input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 3 }, expected: "-1" }
    ],
    starterCode: {
      Python: `def search(nums: list[int], target: int) -> int:
    # Write your solution here in O(log N) binary search
    pass
`,
      JavaScript: `function search(nums, target) {
  // Write your solution here
  return -1;
}
`,
      Java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your solution here
        return -1;
    }
}
`
    },
    solutionCode: {
      Python: `def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        # Determine which half is sorted
        if nums[left] <= nums[mid]: # Left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else: # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`,
      JavaScript: `function search(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}`,
      Java: `class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[left] <= nums[mid]) {
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else {
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        return -1;
    }
}`
    },
    optimalComplexity: {
      time: "O(log N) binary search",
      space: "O(1) constant",
      pitfalls: "Always test which half is normally sorted first, then check if target is inside that half."
    }
  },
  {
    id: "find-duplicate-number",
    title: "287. Find the Duplicate Number",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    platform: "LeetCode Top 75",
    companies: ["Amazon", "Microsoft", "Qualcomm", "Google"],
    description: `Given an array of integers \`nums\` containing \`n + 1\` integers where each integer is in the range \`[1, n]\` inclusive. There is only one repeated number in nums, return this repeated number.

You must solve the problem without modifying the array \`nums\` and uses only constant extra space $O(1)$.`,
    constraints: ["1 <= n <= 10^5", "nums.length == n + 1", "1 <= nums[i] <= n"],
    examples: [{ input: "nums = [1, 3, 4, 2, 2]", output: "2" }, { input: "nums = [3, 1, 3, 4, 2]", output: "3" }],
    testCases: [{ input: { nums: [1, 3, 4, 2, 2] }, expected: "2" }, { input: { nums: [3, 1, 3, 4, 2] }, expected: "3" }],
    starterCode: {
      Python: `def findDuplicate(nums: list[int]) -> int:
    # Write your solution here (Floyd's Tortoise and Hare Cycle Detection)
    pass
`,
      JavaScript: `function findDuplicate(nums) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public int findDuplicate(int[] nums) {
        // Write your solution here
        return 0;
    }
}
`
    },
    solutionCode: {
      Python: `def findDuplicate(nums: list[int]) -> int:
    # Floyd's Tortoise & Hare: O(N) Time | O(1) Space
    slow = fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    # Find entrance to cycle
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow`,
      JavaScript: `function findDuplicate(nums) {
  let slow = nums[0];
  let fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);

  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}`,
      Java: `class Solution {
    public int findDuplicate(int[] nums) {
        int slow = nums[0];
        int fast = nums[0];
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);

        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) linear time cycle detection",
      space: "O(1) strictly constant space without array mutation",
      pitfalls: "Do not use hash sets or array negation if problem prohibits extra space and array modification."
    }
  },
  {
    id: "house-robber",
    title: "198. House Robber",
    difficulty: "Medium",
    category: "Dynamic Programming",
    platform: "LeetCode Top 75",
    companies: ["Google", "Amazon", "Cisco", "Adobe"],
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array \`nums\` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.`,
    constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"],
    examples: [
      { input: "nums = [1, 2, 3, 1]", output: "4", explanation: "Rob house 1 (money = 1) and house 3 (money = 3). Total = 1 + 3 = 4." },
      { input: "nums = [2, 7, 9, 3, 1]", output: "12", explanation: "Rob house 1 (2), 3 (9) and 5 (1). Total = 2 + 9 + 1 = 12." }
    ],
    testCases: [{ input: { nums: [1, 2, 3, 1] }, expected: "4" }, { input: { nums: [2, 7, 9, 3, 1] }, expected: "12" }],
    starterCode: {
      Python: `def rob(nums: list[int]) -> int:
    # Write your solution here (DP: rob = max(prev1, prev2 + num))
    pass
`,
      JavaScript: `function rob(nums) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public int rob(int[] nums) {
        // Write your solution here
        return 0;
    }
}
`
    },
    solutionCode: {
      Python: `def rob(nums: list[int]) -> int:
    prev1 = prev2 = 0
    for num in nums:
        prev1, prev2 = max(prev2 + num, prev1), prev1
    return prev1`,
      JavaScript: `function rob(nums) {
  let prev1 = 0, prev2 = 0;
  for (const num of nums) {
    const temp = Math.max(prev2 + num, prev1);
    prev2 = prev1;
    prev1 = temp;
  }
  return prev1;
}`,
      Java: `class Solution {
    public int rob(int[] nums) {
        int prev1 = 0, prev2 = 0;
        for (int num : nums) {
            int temp = Math.max(prev2 + num, prev1);
            prev2 = prev1;
            prev1 = temp;
        }
        return prev1;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) single pass",
      space: "O(1) two state variables",
      pitfalls: "At each step, decide between skipping current house (prev1) or robbing current house (prev2 + num)."
    }
  },
  {
    id: "subsets",
    title: "78. Subsets (Power Set)",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    platform: "LeetCode Top 75",
    companies: ["Meta", "Amazon", "Bloomberg", "Google"],
    description: `Given an integer array \`nums\` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.`,
    constraints: ["1 <= nums.length <= 10", "-10 <= nums[i] <= 10", "All the numbers of nums are unique."],
    examples: [{ input: "nums = [1, 2, 3]", output: "[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]" }],
    testCases: [{ input: { nums: [1, 2, 3] }, expected: "[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]" }],
    starterCode: {
      Python: `def subsets(nums: list[int]) -> list[list[int]]:
    # Write your solution here (Backtracking or Cascading)
    pass
`,
      JavaScript: `function subsets(nums) {
  // Write your solution here
  return [];
}
`,
      Java: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
}
`
    },
    solutionCode: {
      Python: `def subsets(nums: list[int]) -> list[list[int]]:
    res = []
    def backtrack(start, path):
        res.append(list(path))
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return res`,
      JavaScript: `function subsets(nums) {
  const res = [];
  function backtrack(start, path) {
    res.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return res;
}`,
      Java: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(0, new ArrayList<>(), nums, res);
        return res;
    }
    private void backtrack(int start, List<Integer> path, int[] nums, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(i + 1, path, nums, res);
            path.remove(path.size() - 1);
        }
    }
}`
    },
    optimalComplexity: {
      time: "O(N * 2^N) generating 2^N subsets each of length up to N",
      space: "O(N) recursion stack depth",
      pitfalls: "Remember to clone the path list (list(path) or [...path]) when adding to res."
    }
  },
  {
    id: "lowest-common-ancestor",
    title: "236. Lowest Common Ancestor of a Binary Tree",
    difficulty: "Medium",
    category: "Trees & Graphs",
    platform: "LeetCode Top 75",
    companies: ["Meta", "Amazon", "Microsoft", "Apple"],
    description: `Given a binary tree, find the lowest common ancestor (LCA) of two given nodes \`p\` and \`q\`.

According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).”`,
    constraints: ["2 <= number of nodes <= 10^5", "-10^9 <= Node.val <= 10^9", "All Node.val are unique", "p != q", "p and q exist in the tree."],
    examples: [{ input: "root = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p = 5, q = 1", output: "3" }],
    testCases: [{ input: { root: [3, 5, 1], p: 5, q: 1 }, expected: "3" }],
    starterCode: {
      Python: `def lowestCommonAncestor(root, p, q):
    # Write your solution here
    pass
`,
      JavaScript: `function lowestCommonAncestor(root, p, q) {
  // Write your solution here
  return null;
}
`,
      Java: `class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Write your solution here
        return null;
    }
}
`
    },
    solutionCode: {
      Python: `def lowestCommonAncestor(root, p, q):
    if not root or root == p or root == q:
        return root
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    if left and right:
        return root
    return left if left else right`,
      JavaScript: `function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left ? left : right;
}`,
      Java: `class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }
}`
    },
    optimalComplexity: {
      time: "O(N) visits each node once in worst case",
      space: "O(H) recursion stack height",
      pitfalls: "If left and right recursive calls both return non-null, the current root is the LCA."
    }
  },
  {
    id: "sherlock-valid-string",
    title: "Sherlock and the Valid String",
    difficulty: "Medium",
    category: "HackerRank Interview Prep",
    platform: "HackerRank",
    companies: ["Amazon", "Meta", "Goldman Sachs"],
    description: `Sherlock considers a string to be valid if all characters of the string appear the same number of times. It is also valid if he can remove just 1 character at 1 index in the string, and the remaining characters will occur the same number of times.

Given a string \`s\`, determine if it is valid. If so, return "YES", otherwise return "NO".`,
    constraints: ["1 <= |s| <= 10^5", "s consists of lowercase letters in the range ascii[a-z]."],
    examples: [
      { input: 's = "aabbcd"', output: '"NO"' },
      { input: 's = "aabbccddeefghi"', output: '"NO"' },
      { input: 's = "abcdefghhgfedecba"', output: '"YES"' }
    ],
    testCases: [
      { input: { s: "aabbcd" }, expected: '"NO"' },
      { input: { s: "abcdefghhgfedecba" }, expected: '"YES"' }
    ],
    starterCode: {
      Python: `def isValid(s: str) -> str:
    # Write your solution here
    # Return "YES" or "NO"
    pass
`,
      JavaScript: `function isValid(s) {
  // Write your solution here
  return "NO";
}
`,
      Java: `class Solution {
    public static String isValid(String s) {
        // Write your solution here
        return "NO";
    }
}
`
    },
    solutionCode: {
      Python: `from collections import Counter

def isValid(s: str) -> str:
    char_counts = Counter(s)
    freq_counts = Counter(char_counts.values())

    if len(freq_counts) == 1:
        return "YES"
    if len(freq_counts) == 2:
        (f1, c1), (f2, c2) = freq_counts.items()
        # Case 1: single character with frequency 1 (e.g. 'a':1, 'b':2, 'c':2)
        if (f1 == 1 and c1 == 1) or (f2 == 1 and c2 == 1):
            return "YES"
        # Case 2: higher frequency is exactly 1 greater and occurs only once (e.g. 'a':3, 'b':2, 'c':2)
        if (f1 - f2 == 1 and c1 == 1) or (f2 - f1 == 1 and c2 == 1):
            return "YES"
    return "NO"`,
      JavaScript: `function isValid(s) {
  const charCounts = {};
  for (const c of s) charCounts[c] = (charCounts[c] || 0) + 1;
  const freqCounts = {};
  for (const count of Object.values(charCounts)) {
    freqCounts[count] = (freqCounts[count] || 0) + 1;
  }
  const keys = Object.keys(freqCounts).map(Number);
  if (keys.length === 1) return "YES";
  if (keys.length === 2) {
    const [f1, f2] = keys;
    const c1 = freqCounts[f1], c2 = freqCounts[f2];
    if ((f1 === 1 && c1 === 1) || (f2 === 1 && c2 === 1)) return "YES";
    if ((f1 - f2 === 1 && c1 === 1) || (f2 - f1 === 1 && c2 === 1)) return "YES";
  }
  return "NO";
}`,
      Java: `class Solution {
    public static String isValid(String s) {
        Map<Character, Integer> charCounts = new HashMap<>();
        for (char c : s.toCharArray()) charCounts.put(c, charCounts.getOrDefault(c, 0) + 1);
        Map<Integer, Integer> freqCounts = new HashMap<>();
        for (int count : charCounts.values()) freqCounts.put(count, freqCounts.getOrDefault(count, 0) + 1);

        if (freqCounts.size() == 1) return "YES";
        if (freqCounts.size() == 2) {
            List<Integer> freqs = new ArrayList<>(freqCounts.keySet());
            int f1 = freqs.get(0), f2 = freqs.get(1);
            int c1 = freqCounts.get(f1), c2 = freqCounts.get(f2);
            if ((f1 == 1 && c1 == 1) || (f2 == 1 && c2 == 1)) return "YES";
            if ((f1 - f2 == 1 && c1 == 1) || (f2 - f1 == 1 && c2 == 1)) return "YES";
        }
        return "NO";
    }
}`
    },
    optimalComplexity: {
      time: "O(N) counting characters and frequency frequencies",
      space: "O(alphabet_size) max 26 lowercase English letters",
      pitfalls: "Handle the special case where one character appears only once (freq 1, count 1) so removing it eliminates the character."
    }
  },
  // ==========================================
  // CODECHEF INTERVIEW & CONTEST CLASSICS
  // ==========================================
  {
    id: "chef-and-dolls",
    title: "Chef and Dolls (MISSP)",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    platform: "CodeChef",
    companies: ["Amazon", "Directi", "Media.net"],
    description: `Chef is a doll collector. He has pairs of dolls of each type except one type which is missing its pair.

Given an array \`dolls\` containing the types of dolls, find the doll type that appears an odd number of times.

Can you solve it in $O(N)$ time and $O(1)$ auxiliary space?`,
    constraints: ["1 <= dolls.length <= 10^5", "1 <= dolls[i] <= 10^5"],
    examples: [
      { input: "dolls = [1, 2, 1]", output: "2", explanation: "Type 1 has 2 dolls, Type 2 has 1 doll (odd)." },
      { input: "dolls = [1, 1, 2, 2, 3]", output: "3" }
    ],
    testCases: [
      { input: { dolls: [1, 2, 1] }, expected: "2" },
      { input: { dolls: [1, 1, 2, 2, 3] }, expected: "3" }
    ],
    starterCode: {
      Python: `def chefAndDolls(dolls: list[int]) -> int:
    # Write your solution here (Try bitwise XOR ^=)
    pass
`,
      JavaScript: `function chefAndDolls(dolls) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public int chefAndDolls(int[] dolls) {
        // Write your solution here
        return 0;
    }
}
`,
      "C++": `#include <vector>
using namespace std;

class Solution {
public:
    int chefAndDolls(vector<int>& dolls) {
        // Write your solution here
        return 0;
    }
};
`,
      C: `int chefAndDolls(int* dolls, int n) {
    // Write your solution here
    return 0;
}
`
    },
    solutionCode: {
      Python: `def chefAndDolls(dolls: list[int]) -> int:
    # Bitwise XOR: X ^ X = 0, X ^ 0 = X
    res = 0
    for d in dolls:
        res ^= d
    return res`,
      JavaScript: `function chefAndDolls(dolls) {
  let res = 0;
  for (const d of dolls) {
    res ^= d;
  }
  return res;
}`,
      Java: `class Solution {
    public int chefAndDolls(int[] dolls) {
        int res = 0;
        for (int d : dolls) res ^= d;
        return res;
    }
}`,
      "C++": `#include <vector>
using namespace std;

class Solution {
public:
    int chefAndDolls(vector<int>& dolls) {
        int res = 0;
        for (int d : dolls) res ^= d;
        return res;
    }
};`,
      C: `int chefAndDolls(int* dolls, int n) {
    int res = 0;
    for (int i = 0; i < n; i++) res ^= dolls[i];
    return res;
}`
    },
    optimalComplexity: {
      time: "O(N) single pass",
      space: "O(1) constant bitwise accumulator",
      pitfalls: "Using a hash map works in O(N) space, but bitwise XOR achieves O(1) space."
    }
  },
  {
    id: "lapindromes",
    title: "Lapindromes (LAPIN)",
    difficulty: "Easy",
    category: "Two Pointers & Sliding Window",
    platform: "CodeChef",
    companies: ["Goldman Sachs", "Infosys", "TCS"],
    description: `A Lapindrome is a string whose first half has the exact same characters with the same frequencies as the second half.

If the string length is odd, the middle character is completely ignored.

Given string \`s\`, return \`true\` if \`s\` is a Lapindrome, or \`false\` otherwise.`,
    constraints: ["2 <= s.length <= 1000", "s contains only lowercase English letters."],
    examples: [
      { input: 's = "gaga"', output: "true", explanation: 'First half "ga", second half "ga". Same frequencies.' },
      { input: 's = "rotor"', output: "true", explanation: 'Middle "t" ignored. First half "ro", second half "or" (both have 1 r, 1 o).' },
      { input: 's = "xyz"', output: "false" }
    ],
    testCases: [
      { input: { s: "gaga" }, expected: "true" },
      { input: { s: "rotor" }, expected: "true" },
      { input: { s: "xyz" }, expected: "false" }
    ],
    starterCode: {
      Python: `def isLapindrome(s: str) -> bool:
    # Write your solution here
    pass
`,
      JavaScript: `function isLapindrome(s) {
  // Write your solution here
  return false;
}
`,
      Java: `class Solution {
    public boolean isLapindrome(String s) {
        // Write your solution here
        return false;
    }
}
`,
      "C++": `#include <string>
using namespace std;

class Solution {
public:
    bool isLapindrome(string s) {
        // Write your solution here
        return false;
    }
};
`,
      C: `#include <stdbool.h>
#include <string.h>

bool isLapindrome(char* s) {
    // Write your solution here
    return false;
}
`
    },
    solutionCode: {
      Python: `def isLapindrome(s: str) -> bool:
    n = len(s)
    mid = n // 2
    left = s[:mid]
    right = s[mid:] if n % 2 == 0 else s[mid + 1:]
    return sorted(left) == sorted(right)`,
      JavaScript: `function isLapindrome(s) {
  const n = s.length;
  const mid = Math.floor(n / 2);
  const left = s.slice(0, mid).split("").sort().join("");
  const right = (n % 2 === 0 ? s.slice(mid) : s.slice(mid + 1)).split("").sort().join("");
  return left === right;
}`,
      Java: `class Solution {
    public boolean isLapindrome(String s) {
        int n = s.length();
        int mid = n / 2;
        int[] freq = new int[26];
        for (int i = 0; i < mid; i++) freq[s.charAt(i) - 'a']++;
        int startRight = (n % 2 == 0) ? mid : mid + 1;
        for (int i = startRight; i < n; i++) freq[s.charAt(i) - 'a']--;
        for (int f : freq) if (f != 0) return false;
        return true;
    }
}`,
      "C++": `#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    bool isLapindrome(string s) {
        int n = s.length(), mid = n / 2;
        vector<int> freq(26, 0);
        for (int i = 0; i < mid; i++) freq[s[i] - 'a']++;
        int startRight = (n % 2 == 0) ? mid : mid + 1;
        for (int i = startRight; i < n; i++) freq[s[i] - 'a']--;
        for (int f : freq) if (f != 0) return false;
        return true;
    }
};`,
      C: `#include <stdbool.h>
#include <string.h>

bool isLapindrome(char* s) {
    int n = strlen(s), mid = n / 2;
    int freq[26] = {0};
    for (int i = 0; i < mid; i++) freq[s[i] - 'a']++;
    int startRight = (n % 2 == 0) ? mid : mid + 1;
    for (int i = startRight; i < n; i++) freq[s[i] - 'a']--;
    for (int i = 0; i < 26; i++) if (freq[i] != 0) return false;
    return true;
}`
    },
    optimalComplexity: {
      time: "O(N) character count",
      space: "O(1) 26-element alphabet frequency array",
      pitfalls: "When string length is odd, skip the middle character (index mid)."
    }
  },
  {
    id: "packaging-cupcakes",
    title: "Packaging Cupcakes (MUFFINS3)",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    platform: "CodeChef",
    companies: ["TCS", "Wipro", "Infosys"],
    description: `Chef baked \`n\` cupcakes. He wants to choose a package size \`A\` ($1 \\le A \\le n$) such that as many full packages of size \`A\` are sold as possible, and he keeps the remaining cupcakes \`n % A\`.

Find the package size \`A\` that maximizes the remaining cupcakes Chef gets to take home. If there are multiple answers, return the largest package size.`,
    constraints: ["2 <= n <= 10^8"],
    examples: [
      { input: "n = 2", output: "2", explanation: "Package size 2 leaves 2 % 2 = 0 remainder, but for n = 2 max remainder is at A = 2." },
      { input: "n = 5", output: "3", explanation: "Package size 3 leaves 5 % 3 = 2 cupcakes." }
    ],
    testCases: [
      { input: { n: 2 }, expected: "2" },
      { input: { n: 5 }, expected: "3" }
    ],
    starterCode: {
      Python: `def maxRemainingCupcakes(n: int) -> int:
    # Write your solution here (Mathematical formula)
    pass
`,
      JavaScript: `function maxRemainingCupcakes(n) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public int maxRemainingCupcakes(int n) {
        // Write your solution here
        return 0;
    }
}
`,
      "C++": `class Solution {
public:
    int maxRemainingCupcakes(int n) {
        // Write your solution here
        return 0;
    }
};
`,
      C: `int maxRemainingCupcakes(int n) {
    // Write your solution here
    return 0;
}
`
    },
    solutionCode: {
      Python: `def maxRemainingCupcakes(n: int) -> int:
    # Maximum remainder occurs when package size A = (n // 2) + 1
    return (n // 2) + 1`,
      JavaScript: `function maxRemainingCupcakes(n) {
  return Math.floor(n / 2) + 1;
}`,
      Java: `class Solution {
    public int maxRemainingCupcakes(int n) {
        return (n / 2) + 1;
    }
}`,
      "C++": `class Solution {
public:
    int maxRemainingCupcakes(int n) {
        return (n / 2) + 1;
    }
};`,
      C: `int maxRemainingCupcakes(int n) {
    return (n / 2) + 1;
}`
    },
    optimalComplexity: {
      time: "O(1) constant time mathematical deduction",
      space: "O(1) zero auxiliary memory",
      pitfalls: "A loop from 1 to n will get TLE because n can be 10^8."
    }
  },
  {
    id: "uncle-johny",
    title: "Uncle Johny (JOHNY)",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    platform: "CodeChef",
    companies: ["Samsung", "Cognizant", "Amazon"],
    description: `Vlad has a playlist of \`n\` songs with distinct lengths. His favorite song "Uncle Johny" is initially at 1-based index \`k\`.

After sorting the playlist in ascending order of length, find the new 1-based index of "Uncle Johny".`,
    constraints: ["1 <= n <= 100", "1 <= k <= n", "1 <= lengths[i] <= 10^9"],
    examples: [
      { input: "lengths = [1, 3, 4, 2], k = 2", output: "3", explanation: 'Song at index 2 has length 3. After sorting [1, 2, 3, 4], length 3 is at 1-based index 3.' }
    ],
    testCases: [
      { input: { lengths: [1, 3, 4, 2], k: 2 }, expected: "3" },
      { input: { lengths: [10, 20, 30], k: 1 }, expected: "1" }
    ],
    starterCode: {
      Python: `def uncleJohny(lengths: list[int], k: int) -> int:
    # Write your solution here
    pass
`,
      JavaScript: `function uncleJohny(lengths, k) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public int uncleJohny(int[] lengths, int k) {
        // Write your solution here
        return 0;
    }
}
`,
      "C++": `#include <vector>
using namespace std;

class Solution {
public:
    int uncleJohny(vector<int>& lengths, int k) {
        // Write your solution here
        return 0;
    }
};
`,
      C: `int uncleJohny(int* lengths, int n, int k) {
    // Write your solution here
    return 0;
}
`
    },
    solutionCode: {
      Python: `def uncleJohny(lengths: list[int], k: int) -> int:
    target = lengths[k - 1]
    # In sorted array of distinct elements, new 1-based index is
    # (number of elements strictly smaller than target) + 1
    smaller = sum(1 for x in lengths if x < target)
    return smaller + 1`,
      JavaScript: `function uncleJohny(lengths, k) {
  const target = lengths[k - 1];
  let smaller = 0;
  for (const x of lengths) {
    if (x < target) smaller++;
  }
  return smaller + 1;
}`,
      Java: `class Solution {
    public int uncleJohny(int[] lengths, int k) {
        int target = lengths[k - 1];
        int smaller = 0;
        for (int x : lengths) if (x < target) smaller++;
        return smaller + 1;
    }
}`,
      "C++": `#include <vector>
using namespace std;

class Solution {
public:
    int uncleJohny(vector<int>& lengths, int k) {
        int target = lengths[k - 1];
        int smaller = 0;
        for (int x : lengths) if (x < target) smaller++;
        return smaller + 1;
    }
};`,
      C: `int uncleJohny(int* lengths, int n, int k) {
    int target = lengths[k - 1];
    int smaller = 0;
    for (int i = 0; i < n; i++) {
        if (lengths[i] < target) smaller++;
    }
    return smaller + 1;
}`
    },
    optimalComplexity: {
      time: "O(N) single pass counting elements smaller than target",
      space: "O(1) without sorting",
      pitfalls: "Remember the problem uses 1-based indexing for k and return index."
    }
  },
  {
    id: "carvans",
    title: "Carvans (CARVANS)",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    platform: "CodeChef",
    companies: ["Directi", "Amazon", "Flipkart"],
    description: `A single-lane straight highway has \`n\` cars traveling in the same direction. Each car has a maximum speed. Because the road is single-lane, a car cannot overtake the car ahead.

If a car catches up to a slower car, it is forced to slow down to that slower car's speed.

Given an array of initial maximum speeds of cars in order from first to last, determine how many cars can travel at their maximum speed.`,
    constraints: ["1 <= n <= 10^5", "1 <= speeds[i] <= 2 * 10^9"],
    examples: [
      { input: "speeds = [4, 5, 1, 2, 3]", output: "2", explanation: "Car 1 (speed 4) has no one ahead (travels at 4). Car 2 slows to 4. Car 3 travels at 1 (max speed). Car 4 & 5 slow to 1. Total = 2 cars." }
    ],
    testCases: [
      { input: { speeds: [4, 5, 1, 2, 3] }, expected: "2" },
      { input: { speeds: [8, 3, 6] }, expected: "2" }
    ],
    starterCode: {
      Python: `def maxSpeedCars(speeds: list[int]) -> int:
    # Write your solution here
    pass
`,
      JavaScript: `function maxSpeedCars(speeds) {
  // Write your solution here
  return 0;
}
`,
      Java: `class Solution {
    public int maxSpeedCars(int[] speeds) {
        // Write your solution here
        return 0;
    }
}
`,
      "C++": `#include <vector>
using namespace std;

class Solution {
public:
    int maxSpeedCars(vector<int>& speeds) {
        // Write your solution here
        return 0;
    }
};
`,
      C: `int maxSpeedCars(int* speeds, int n) {
    // Write your solution here
    return 0;
}
`
    },
    solutionCode: {
      Python: `def maxSpeedCars(speeds: list[int]) -> int:
    if not speeds:
        return 0
    count = 1
    min_speed = speeds[0]
    for s in speeds[1:]:
        if s <= min_speed:
            count += 1
            min_speed = s
    return count`,
      JavaScript: `function maxSpeedCars(speeds) {
  if (!speeds.length) return 0;
  let count = 1;
  let minSpeed = speeds[0];
  for (let i = 1; i < speeds.length; i++) {
    if (speeds[i] <= minSpeed) {
      count++;
      minSpeed = speeds[i];
    }
  }
  return count;
}`,
      Java: `class Solution {
    public int maxSpeedCars(int[] speeds) {
        if (speeds == null || speeds.length == 0) return 0;
        int count = 1;
        int minSpeed = speeds[0];
        for (int i = 1; i < speeds.length; i++) {
            if (speeds[i] <= minSpeed) {
                count++;
                minSpeed = speeds[i];
            }
        }
        return count;
    }
}`,
      "C++": `#include <vector>
using namespace std;

class Solution {
public:
    int maxSpeedCars(vector<int>& speeds) {
        if (speeds.empty()) return 0;
        int count = 1, minSpeed = speeds[0];
        for (size_t i = 1; i < speeds.size(); i++) {
            if (speeds[i] <= minSpeed) {
                count++;
                minSpeed = speeds[i];
            }
        }
        return count;
    }
};`,
      C: `int maxSpeedCars(int* speeds, int n) {
    if (n <= 0) return 0;
    int count = 1;
    int minSpeed = speeds[0];
    for (int i = 1; i < n; i++) {
        if (speeds[i] <= minSpeed) {
            count++;
            minSpeed = speeds[i];
        }
    }
    return count;
}`
    },
    optimalComplexity: {
      time: "O(N) single linear scan",
      space: "O(1) constant extra memory",
      pitfalls: "A car can travel at max speed if and only if its max speed is <= the minimum speed seen so far ahead of it."
    }
  }
];
