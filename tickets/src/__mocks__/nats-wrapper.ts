export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation((subj, data, cb) => cb()),
  },
  connect() {},
};
