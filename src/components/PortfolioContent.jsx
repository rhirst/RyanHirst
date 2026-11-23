import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PortfolioContent() {
  return (
    <div className="flex flex-col gap-3">
      <Card role="region" aria-label="About me">
        <CardContent>
          <p>
            <strong>Hi, I'm Ryan!</strong>  I'm a software engineer with a passion for accessibility, design systems, and
            making complicated tools easier to use.
          </p>
        </CardContent>
      </Card>
      <Card className="content-card" role="region" aria-labelledby="ai-heading">
        <CardHeader>
          <CardTitle>
            <h2 id="ai-heading">Current Role</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            At NetSpeek, I connect our LLM and AI capabilities with the rest of the
            application, helping create a seamless experience for our users. I build intuitive UIs that reduce friction and highlight the power of the underlying tech.
          </p>
        </CardContent>
      </Card>
      <Card role="region" aria-labelledby="react-heading">
        <CardHeader>
          <CardTitle>
            <h2 id="react-heading">React &amp; application architecture</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            My framework of choice. From Comcast’s prepaid dashboard to NetSpeek’s
            device management tools, I’ve used React to turn complicated workflows
            into manageable pieces. I enjoy figuring out how
            components fit together, where state belongs, and all the small details that make the next feature easier to
            build.
          </p>
        </CardContent>
      </Card>
      <Card role="region" aria-labelledby="ui-heading">
        <CardHeader>
          <CardTitle>
            <h2 id="ui-heading">Accessible UI &amp; design systems</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            I'm big on details. keyboard navigation, sensible focus behavior, and
            feedback that makes sense when something happens (including when it goes wrong!). Tailwind, Radix,
            and Storybook help me turn those details into reusable components,
            with tests to keep them working as the product grows.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
