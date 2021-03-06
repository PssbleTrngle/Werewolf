package werwolf

import org.grails.orm.hibernate.cfg.GrailsHibernateUtil

class ActionController {
	static responseFormats = ['json', 'xml']
    static allowedMethods = [save: 'POST']

    /**
    *    Handles POST request to /action
    *    These are decisions the user selects on his current screen,
    *    like voting for someone or pressing 'ready'
    */
    def save() {
        def json = request.getJSON()

        try {
            String token = json['token']
            User target = User.get(json['target'])
            String option = json['option']

            assert token != null: 'User token missing'

            User user = UserController.getUser(token)
            assert user != null: 'User missing'
            assert user?.game instanceof Game: 'User is not part of a Game'

            Screen screen = user.unwrapScreen()
            assert screen != null: 'User has no screen'

            /* Check if option is valid for screen */
            boolean valid =
                    (target != null && screen.getTargets(user.game.users, user).find({ User t -> t.id == target.id })) ||
                            (option != null && screen.options().contains(option))
            assert valid: 'Invalid option for screen'

            /* Check if user has already voted */
            Decision existing = Decision.find({ d ->
                d.user.id == user.id && d.screen.id == screen.id
            })
            assert !existing: 'User has already voted'

            /* Save the logged in decision */
            Decision.withTransaction({

                new Decision(selection: option, user: user, target: target, screen: screen).save()
                Screen.withTransaction({
                    screen.save()
                    user.game.checkDone()
                })

            })

            return [ success: true ]

        } catch (AssertionError e) {

            /* An assertion has failed, the message is send back for debug purposes */
            return [ success: false, message: e.getMessage() ]

        }
    }

}
