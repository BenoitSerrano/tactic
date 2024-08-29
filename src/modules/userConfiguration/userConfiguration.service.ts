import { dataSource } from '../../dataSource';
import { examEdgeTextKind } from '../exam/types';
import { User } from '../user/User.entity';
import { UserConfiguration } from './UserConfiguration.entity';

const edgeTextKindMapping: Record<examEdgeTextKind, 'defaultStartText' | 'defaultEndText'> = {
    start: 'defaultStartText',
    end: 'defaultEndText',
};

export { buildUserConfigurationService };

function buildUserConfigurationService() {
    const userConfigurationRepository = dataSource.getRepository(UserConfiguration);

    const userConfigurationService = {
        updateDefaultEdgeText,
    };

    return userConfigurationService;

    async function updateDefaultEdgeText(user: User, kind: examEdgeTextKind, text: string) {
        const column = edgeTextKindMapping[kind];
        const result = await userConfigurationRepository.update(
            { id: user.userConfiguration.id },
            { [column]: text },
        );
        return result.affected === 1;
    }
}
