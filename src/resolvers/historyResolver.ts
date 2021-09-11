// import { Item } from "../entity/Item";

// export const historyResolvers = {
//   Query: {
//     getTaken: async (_: any, args: HistoryItems) => {
//       const { userId, skip, first } = args;
//       try {
//         return await Item.find({
//           where: { takerId: userId },
//           relations: ["images", "giver"],
//           skip: skip,
//           take: first,
//         });
//       } catch (err) {
//         throw new Error(err ? err : "Server error!");
//       }
//     },
//     getGiven: async (_: any, args: HistoryItems) => {
//       const { userId, skip, first } = args;
//       try {
//         return await Item.find({
//           where: { giverId: userId },
//           relations: ["images"],
//           skip: skip,
//           take: first,
//         });
//       } catch (err) {
//         throw new Error(err ? err : "Server error!");
//       }
//     },
//   },
//   Mutation: {},
// };
