import zod from "zod";

export const IdSchema = zod.string().min(1);

export const IdParameter = zod.object({ id: IdSchema });

const SkipVoteSchema = zod.object({
  type: zod.literal("skip"),
});

const PlayerVoteSchema = zod.object({
  type: zod.literal("players"),
  players: zod.array(IdSchema),
});

export const VoteSchema = zod.discriminatedUnion("type", [
  SkipVoteSchema,
  PlayerVoteSchema,
]);
