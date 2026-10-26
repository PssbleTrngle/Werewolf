# Unsure Scenarios

This file documents some very specific scenarios that have been found, where it is unsure how it actually should work.

## Execution targets Cursed or a Revived Player

If the cursed is attacked by the wolves, they die and get immediatly revived.
This does not cause any problems with the witch, because their revive is created asynchronously using the `WitchTrigger`, 
therefore not firing if the player got revived again in the mean-time.
It does however directly trigger the execution, who will turn into a jester.
This also happens when the player is revived by the witch.

Should both or any of these cases count as the executioner loosing their target and becoming a jester,
because the got revived before the executioner even knew they died.