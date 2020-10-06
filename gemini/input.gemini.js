import GeminiBox from '../gemini-utils/gemini-box/gemini-box';
import Input from '../src/input';
import Radio from '../src/radio';
import RadioGroup from '../src/radio-group';

function renderAddons(inputSize) {
    let radioSize;

    switch (inputSize) {
        case 's':
        case 'm':
            radioSize = 's';
            break;
        case 'l':
            radioSize = 'm';
            break;
        case 'xl':
            radioSize = 'l';
            break;
    }

    const buttonControlNodes = [1, 2, 3].map((item) => (
        <Radio key={ item } size={ radioSize } type="button" text={ item } />
    ));

    return <RadioGroup type="button">{ buttonControlNodes }</RadioGroup>;
}

const NAME = 'input';
const THEMES = ['alfa-on-color', 'alfa-on-white'];
const SIZES = process.env.ALL_SIZES ? ['s', 'm', 'l', 'xl'] : ['m'];

const PROP_SETS = [
    {
        placeholder: 'Input',
    },
    {
        placeholder: 'Input with width available',
        width: 'available',
    },
    {
        placeholder: 'Input',
        error: 'Something went wrong',
    },
    {
        placeholder: 'Input',
        clear: true,
    },
    {
        disabled: true,
    },
];

geminiReact.suite(NAME, () => {
    THEMES.forEach((theme) => {
        const themeSelector = `${NAME}_theme_${theme}`;

        SIZES.forEach((size) => {
            const sizeSelector = `${NAME}_size_${size}`;

            PROP_SETS.forEach((set, index) => {
                const selector = `${themeSelector}.${sizeSelector}.${NAME}_prop-set_${index + 1}`;

                if (set.view === 'line' && size !== 'm') {
                    return;
                }

                geminiReact.suite(selector, (suite) => {
                    const props = {
                        theme,
                        size,
                        rightAddons: (index === 0 || index === 1) && renderAddons(size),
                        leftAddons: (index === 0 || index === 1) && renderAddons(size),
                        ...set,
                    };
                    const template = (
                        <GeminiBox theme={ theme } width={ set.width }>
                            <Input { ...props } />
                        </GeminiBox>
                    );

                    if (set.disabled) {
                        suite.render(template).capture('plain');
                    } else {
                        suite
                            .render(template)
                            .capture('plain')
                            .capture('hovered', function hovered(actions) {
                                actions.mouseMove(this.renderedComponent);
                            })
                            .capture('pressed', function pressed(actions) {
                                actions.mouseDown(this.renderedComponent);
                            })
                            .capture('focused', (actions, find) => {
                                actions.focus(find('.input__control'));
                            });
                    }
                });
            });
        });
    });
});
