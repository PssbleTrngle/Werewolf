import { type Vote } from "models";
import { requireSessionView } from "../auth";
import schemaBuilder from "./builder";
import { SucessfulAction } from "./results";

const VoteInput = schemaBuilder.inputRef<Vote>("VoteInput").implement({
  fields: (t) => ({
    type: t.string({ required: true }),
    players: t.idList(),
  }),
});

schemaBuilder.mutationField("vote", (t) =>
  t.field({
    type: SucessfulAction,
    args: {
      game: t.arg({
        type: "ID",
        description: "ID of the lobby",
        required: true,
      }),
      vote: t.arg({
        type: VoteInput,
        required: true,
      }),
    },
    resolve: async (_, args, context) => {
      const view = await requireSessionView(context, args.game);
      await view.vote(args.vote);
      return { success: true };
    },
  }),
);
