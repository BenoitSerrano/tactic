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
        createUserConfiguration,
        updateDefaultEdgeText,
        getAllUserConfigurations,
    };

    return userConfigurationService;

    async function getAllUserConfigurations() {
        return userConfigurationRepository.find({});
    }

    async function updateDefaultEdgeText(user: User, kind: examEdgeTextKind, text: string) {
        const column = edgeTextKindMapping[kind];
        const result = await userConfigurationRepository.update(
            { id: user.userConfiguration.id },
            { [column]: text },
        );
        return result.affected === 1;
    }

    async function createUserConfiguration() {
        const result = await userConfigurationRepository.insert({});
        const newUserConfigurationId = result.identifiers[0].id as UserConfiguration['id'];
        return userConfigurationRepository.findOneByOrFail({ id: newUserConfigurationId });
    }
}
