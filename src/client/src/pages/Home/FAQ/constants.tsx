import { ReactNode } from 'react';

const FAQ_CONTENT: Array<{ question: string; answer: string | ReactNode }> = [
    {
        question: 'Puis-je utiliser Tactic gratuitement ?',
        answer: 'Oui, la correction des 30 premières copies est entièrement gratuite. Vous pourrez ensuite choisir un forfait adapté à vos besoins.',
    },
    {
        question: 'Comment les élèves accèdent-ils aux examens ?',
        answer: "Vous pouvez partager avec eux un lien unique généré par la plateforme. Les élèves n'ont pas besoin de créer un compte, ils accèderont directement à l'examen en renseignant l'adresse e-mail avec laquelle vous les aurez inscrits.",
    },
    {
        question: "Quels types d'exercices sont présents sur la plateforme ?",
        answer: (
            <div>
                <p>
                    La plateforme offre aux professeurs la possibilité de créer les exercices
                    suivants :
                    <ul>
                        <li>
                            <strong>QCM</strong> : le professeur pose une question et enregistre au
                            préalable les réponses possibles. L'élève choisit entre les réponses
                            possibles celle qui lui semble juste.
                        </li>
                        <li>
                            <strong>Question / réponse</strong> : le professeur pose une question et
                            enregistre au préalable la ou les réponse(s) attendue(s), pour
                            lesquelles la question sera donc automatiquement corrigée. L'élève doit
                            taper la réponse qui lui semble juste.
                        </li>
                        <li>
                            <strong>Texte à trous</strong> : le professeur enregistre un texte et
                            sélectionne les mots ou expressions devant être cachés lors de la
                            composition. L'élève doit ensuite remplir les trous avec les mots ou
                            expressions qui lui semblent juste.
                        </li>
                        <li>
                            <strong>Phrase à reconstituer</strong> : le professeur enregistre une
                            phrase et choisit la version mélangée de cette phrase qui lui convient.
                            L'élève doit ensuite ré-ordonner la phrase.
                        </li>
                        <li>
                            <strong>Texte libre</strong> : le professeur pose une question sans
                            indiquer de réponse attendue. L'élève doit ensuite y répondre.
                        </li>
                    </ul>
                </p>
                <p>
                    Pour les questions de type <strong>question / réponse</strong>, 
                    <strong>texte à trous</strong> et <strong>phrase à reconstituer</strong>, le
                    professeur peut, à la fin de l'examen, passer sur chaque copie et attribuer à
                    l'aide d'un système intuitif 25%, 50% ou 75% de la note maximale pour la
                    question.
                </p>
            </div>
        ),
    },
    {
        question: 'Comment fonctionne la correction automatique ?',
        answer: "Lors de la création de l'examen, vous spécifiez via une interface intuitive les réponses correctes pour vos exercices. Après le passage de l'examen par vos élèves, vous pouvez toujours parcourir les copies pour vérifier que la correction est conforme à vos attentes, et attribuer des points à certaines réponses que vous considéreriez comme partiellement correctes. Pour vous simplifier la correction et permettre une notation équitable, si vous attribuez une note à une réponse partiellement correcte, tous les autres élèves ayant fourni la même réponse se verront automatiquement gratifiés du même nombre de points pour la question concernée.",
    },
    {
        question: "Que se passe-t-il en cas de problème technique au cours d'un examen ?",
        answer: 'Si un problème technique avéré survient au cours d\'un examen, nous remboursons les copies concernées. Une équipe support est par ailleurs prête à répondre à vos questions via l\'icône "?" en bas à droite de votre écran lorsque vous êtes sur votre tableau de bord.',
    },
    {
        question: 'Mes données et celles des élèves sont-elles sécurisées ?',
        answer: 'Oui, toutes les données sont stockées en France sur des serveurs sécurisés, conformément aux réglementations RGPD.',
    },
];

export { FAQ_CONTENT };
