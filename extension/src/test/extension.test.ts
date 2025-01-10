import * as assert from 'assert';
import * as vscode from 'vscode';
import { activate, deactivate } from '../extension';

suite('Extension Test Suite', () => {
    setup(async () => {
        await activate();
    });

    teardown(async () => {
        await deactivate();
    });

    test('Sample test', () => {
        assert.strictEqual(1 + 1, 2);
    });

    // Add more tests here
});