import { Divider, Link, Stack, Typography } from "@mui/material";
import { FunctionComponent } from "react";

const HowAssertionsWork: FunctionComponent = () => {
  return (
    <>
      <Stack spacing={2}>
        <Typography variant="subtitle1" gutterBottom>
          What is assertions
        </Typography>

        <Stack>
          <Typography variant="body2" color="text.secondary">
            Assertions are statements you create that check one aspect of the
            HTTP response. You can create multiple assertions for one check that
            assert various aspects of a response, for example:
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <ul>
              <li>Response status code equals 200.</li>
              <li>Response body equals the text “success”.</li>
              <li>Response total time is lower than 2000 milliseconds.</li>
              <li>Response header “X-Custom-Header” equals “SomeValue”.</li>
              <li>
                Response JSON object has a key called “accountBalance” with a
                value greater than 9999
              </li>
            </ul>
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            In each assertion, a source is connected to a operator and a target.
            Some assertions sources such as headers and JSON body has a property
            field that can be used to assert a specific header or JSON key.
          </Typography>
        </Stack>

        <Divider />

        <Typography variant="subtitle1" gutterBottom>
          JSON body assertions property syntax
        </Typography>

        <Stack>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            When the source is set to JSON body, you can use the property field
            to assert a specific key in the JSON response body by using JSON
            path.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Use <Link href="https://jsonpath.com/">this online editor</Link> to
            play around with the syntax.
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};

export default HowAssertionsWork;
