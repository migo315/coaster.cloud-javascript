const mockAxiosPost = jest.fn();
jest.mock('axios', () => {
    return { post: mockAxiosPost };
});

jest.mock('../config', () => {
    return { baseUrl: 'https://test' };
});

global.console = {
    error: jest.fn(),
};

const stubbedToken = 'auth-token';

const mockBuildQuery = jest.fn();
jest.mock('../src/build-query', () => {
    return {
        buildQuery: mockBuildQuery,
    };
});

const Client = require('../src/client');

describe('Add Waiting Times', () => {
    const stubbedQueues = {
        data: {
            info: {
                name: 'Big Dipper',
                wait: 30,
            },
        },
    };

    beforeEach(() => {
        mockAxiosPost.mockImplementation(() => {
            return true;
        });
    });

    describe('when a successful request is made with an empty config', () => {
        const expectedUrl = 'https://test/parks/Phantasialand/waiting-times';
        const expectedConfig = {
            headers: {
                'X-Auth-Token': stubbedToken,
            },
        };

        let response;

        beforeEach(async () => {
            mockBuildQuery.mockReturnValueOnce('');
            response = await Client.addWaitingTimes(stubbedToken, 'Phantasialand', stubbedQueues);
        });

        it('calls axios once', () => {
            expect(mockAxiosPost.mock.calls.length).toBe(1);
        });

        it('calls axios with the queues data, auth headers and expected url', () => {
            expect(mockAxiosPost.mock.calls[0][1]).toEqual(stubbedQueues);
            expect(mockAxiosPost.mock.calls[0][2]).toEqual(expectedConfig);
            expect(mockAxiosPost.mock.calls[0][0]).toEqual(expectedUrl);
        });

        it('returns true', () => {
            expect(response).toEqual(true);
        });
    });

    describe('when an unsuccessful request is made', () => {
        const stubbedError = new Error('some error');
        let response;

        beforeEach(async () => {
            jest.spyOn(global.console, 'error');

            mockAxiosPost.mockImplementation(() => {
                throw new Error('some error');
            });

            response = await Client.addWaitingTimes();
        });

        it('console logs the error and returns false', () => {
            expect(console.error.mock.calls[0][0]).toEqual(stubbedError);
            expect(response).toEqual(false);
        });
    });
});
