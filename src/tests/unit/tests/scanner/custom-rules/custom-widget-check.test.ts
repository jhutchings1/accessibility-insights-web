// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';
import { difference, map } from 'lodash';
import { Mock, MockBehavior } from 'typemoq';

import { customWidgetConfiguration } from '../../../../../scanner/custom-rules/custom-widget';
import { ICheckConfiguration } from '../../../../../scanner/iruleresults';

const axe = Axe as any;
const fixture = createTestFixture('test-fixture', '');

const context = {
    _data: null,
    data: function (d: any): any {
        // tslint:disable-next-line:no-invalid-this
        this._data = d;
    },
};

describe('custom-widget check', () => {
    it('check exists', () => {
        const check = getCheck('custom-widget');
        expect(check).not.toBeNull();
    });
});

describe('custom-widget check', () => {
    const axeTextFunctionBackup: (node: Element) => string = axe.commons.text.accessibleText;
    const textFunctionMock = Mock.ofInstance((node: Element, isLabelledByContext: boolean) => {
        return '';
    }, MockBehavior.Strict);

    beforeEach(() => {
        context._data = null;
    });

    afterEach(() => {
        axe.commons.text.accessibleText = axeTextFunctionBackup;
        textFunctionMock.reset();
    });

    it('creates expected data object', () => {
        fixture.innerHTML = `
            <div id="myElement"/>
            `;

        const node = fixture.querySelector('#myElement');
        axe._tree = axe.utils.getFlattenedTree(document.documentElement);

        expect(customWidgetConfiguration.checks[0].evaluate.call(context, node)).toBeTruthy();
        expect(context._data).toEqual({
            accessibleName: '',
            role: null,
            describedBy: '',
            htmlCues: {},
            ariaCues: {},
        });
    });

    it('returns described-by data', () => {
        fixture.innerHTML = `
            <div id="myElement"
            aria-describedby="desc" />
            <div id="desc">my description</div>
            `;

        const node = fixture.querySelector('#myElement');
        axe._tree = axe.utils.getFlattenedTree(document.documentElement);

        expect(customWidgetConfiguration.checks[0].evaluate.call(context, node)).toBeTruthy();
        expect(context._data.describedBy).toEqual('my description');
    });

    it('returns accessibleName data', () => {
        fixture.innerHTML = `
            <div id="myElement" />
            `;

        const node = fixture.querySelector('#myElement');

        axe.commons.text.accessibleText = textFunctionMock.object;

        textFunctionMock.setup(m => m(node, false)).returns(() => 'my text');

        expect(customWidgetConfiguration.checks[0].evaluate.call(context, node)).toBeTruthy();
        expect(context._data.accessibleName).toEqual('my text');
    });

    it('returns role data', () => {
        fixture.innerHTML = `
            <div id="myElement"
            role="sandwich"/>
            `;

        axe._tree = axe.utils.getFlattenedTree(document.documentElement);
        const node = fixture.querySelector('#myElement');

        expect(customWidgetConfiguration.checks[0].evaluate.call(context, node)).toBeTruthy();
        expect(context._data.role).toEqual('sandwich');
    });
});

describe('custom-widget check', () => {
    const selector = customWidgetConfiguration.rule.selector;
    const allRoles = Object.getOwnPropertyNames(axe.commons.aria.lookupTable.role);
    const expectedRoles = [
        'alert',
        'alertdialog',
        'button',
        'checkbox',
        'combobox',
        'dialog',
        'feed',
        'grid',
        'link',
        'listbox',
        'menu',
        'menubar',
        'radiogroup',
        'separator',
        'slider',
        'spinbutton',
        'table',
        'tablist',
        'toolbar',
        'tooltip',
        'tree',
        'treegrid',
    ];
    const unexpectedRoles = difference(allRoles, expectedRoles);

    it('selector exists', () => {
        expect(selector).not.toBeNull();
    });

    expectedRoles.forEach((role: string) => {
        it('matches ' + role + ' role', () => {
            fixture.innerHTML =
                `
            <div role="` +
                role +
                `" id="myElement" />
            `;

            const node = fixture.querySelector('#myElement');

            expect(node.matches(selector)).toBeTruthy();
        });
    }); // for expected roles

    unexpectedRoles.forEach((role: string) => {
        it('does not match ' + role + ' role', () => {
            fixture.innerHTML =
                `
            <div role="` +
                role +
                `" id="myElement" />
            `;

            const node = fixture.querySelector('#myElement');

            expect(node.matches(selector)).toBeFalsy();
        });
    }); // for unexpected roles
});

describe('custom-widget check', () => {
    const allAriaAttributes = Object.getOwnPropertyNames(axe.commons.aria.lookupTable.attributes);
    const overlappingHTMLAttributes = map(allAriaAttributes, s => s.replace('aria-', ''));
    const allAttributes = allAriaAttributes.concat(overlappingHTMLAttributes);
    const expectedARIAAttributes = ['aria-disabled', 'aria-readonly', 'aria-required'];
    const unexpectedARIAAttributes = difference(allAttributes, expectedARIAAttributes);
    const expectedHTMLAttributes = ['disabled', 'readonly', 'required'];
    const unexpectedHTMLAttributes = difference(allAttributes, expectedHTMLAttributes);

    beforeEach(() => {
        context._data = null;
    });

    expectedARIAAttributes.forEach((attribute: string) => {
        it(`expected '` + attribute + `'in ariaCues`, () => {
            fixture.innerHTML =
                `
        <div id="myElement"
        ` +
                attribute +
                `="value" />
        `;

            axe._tree = axe.utils.getFlattenedTree(document.documentElement);
            const node = fixture.querySelector('#myElement');

            customWidgetConfiguration.checks[0].evaluate.call(context, node);

            expect(context._data.ariaCues[attribute]).toEqual('value');
        });
    }); // for expected ARIA attributes

    unexpectedARIAAttributes.forEach((attribute: string) => {
        it(`did not expect '` + attribute + `'in ariaCues`, () => {
            fixture.innerHTML =
                `
        <div id="myElement"
        ` +
                attribute +
                `="value" />
        `;

            axe._tree = axe.utils.getFlattenedTree(document.documentElement);
            const node = fixture.querySelector('#myElement');

            customWidgetConfiguration.checks[0].evaluate.call(context, node);

            expect(context._data.ariaCues[attribute]).toBeUndefined();
        });
    }); // for unexpected ARIA attributes

    expectedHTMLAttributes.forEach((attribute: string) => {
        it(`expected '` + attribute + `'in htmlCues`, () => {
            fixture.innerHTML =
                `
        <div id="myElement"
        ` +
                attribute +
                `="value" />
        `;

            axe._tree = axe.utils.getFlattenedTree(document.documentElement);
            const node = fixture.querySelector('#myElement');

            customWidgetConfiguration.checks[0].evaluate.call(context, node);

            expect(context._data.htmlCues[attribute]).toEqual('value');
        });
    }); // for expected HTML attributes

    unexpectedHTMLAttributes.forEach((attribute: string) => {
        it(`did not expect '` + attribute + `'in htmlCues`, () => {
            fixture.innerHTML =
                `
        <div id="myElement"
        ` +
                attribute +
                `="value" />
        `;

            axe._tree = axe.utils.getFlattenedTree(document.documentElement);
            const node = fixture.querySelector('#myElement');

            customWidgetConfiguration.checks[0].evaluate.call(context, node);

            expect(context._data.htmlCues[attribute]).toBeUndefined();
        });
    }); // for unexpected HTML attributes
});

function getCheck(checkId: string): ICheckConfiguration {
    return axe._audit.defaultConfig.checks.find(elem => elem.id === checkId);
}

function createTestFixture(id: string, content: string): HTMLDivElement {
    const testFixture: HTMLDivElement = document.createElement('div');
    testFixture.setAttribute('id', id);
    document.body.appendChild(testFixture);
    testFixture.innerHTML = content;
    return testFixture;
}
