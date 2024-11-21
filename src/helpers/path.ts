import * as shape from 'd3-shape';

const getCircleCoordinates = (
  x0: number,
  y0: number,
  radius: number,
  degrees: number,
) => {
  const radians = degrees * (Math.PI / 180);

  return {
    x: x0 + radius * Math.cos(radians),
    y: y0 + radius * Math.sin(radians),
  };
};

export const getBottomTabPath = (
  width: number,
  iHeight: number,
  centerWidth: number,
): any => {
  const cornerRadius = 10;

  const height = iHeight;
  const circleWidth = centerWidth + 18;

  const circleX0 = width / 2;
  const circleY0 = 0;

  return (shape as any)
    .line()
    .x((d: {x: any}) => d.x)
    .y((d: {y: any}) => d.y)
    .curve(shape.curveBasis)([
    // right
    {x: width / 2 + circleWidth / 2 + cornerRadius, y: 0},
    {x: width - cornerRadius, y: 0},
    {
      ...getCircleCoordinates(
        width - cornerRadius,
        cornerRadius,
        cornerRadius,
        275,
      ),
    },
    {
      ...getCircleCoordinates(
        width - cornerRadius,
        cornerRadius,
        cornerRadius,
        300,
      ),
    },
    {
      ...getCircleCoordinates(
        width - cornerRadius,
        cornerRadius,
        cornerRadius,
        325,
      ),
    },
    {x: width, y: cornerRadius},
    {x: width, y: cornerRadius},

    // bottom
    {x: width, y: height - cornerRadius},
    {x: width, y: height},
    {x: width, y: height},

    {x: 0, y: height},
    {x: 0, y: height},
    // left
    {x: 0, y: height},
    {x: 0, y: 8},
    {
      ...getCircleCoordinates(cornerRadius, cornerRadius, cornerRadius, 200),
    },
    {
      ...getCircleCoordinates(cornerRadius, cornerRadius, cornerRadius, 230),
    },
    {
      ...getCircleCoordinates(cornerRadius, cornerRadius, cornerRadius, 245),
    },
    {x: 8, y: 0},

    // left center corner
    // {
    //   x: circleX0 - circleWidth / 2 - cornerRadius,
    //   y: 0,
    // },
    // {
    //   ...getCircleCoordinates(
    //     circleX0 - circleWidth / 2 - cornerRadius,
    //     cornerRadius,
    //     cornerRadius,
    //     275,
    //   ),
    // },
    // {
    //   ...getCircleCoordinates(
    //     circleX0 - circleWidth / 2 - cornerRadius,
    //     cornerRadius,
    //     cornerRadius,
    //     300,
    //   ),
    // },
    // {
    //   ...getCircleCoordinates(
    //     circleX0 - circleWidth / 2 - cornerRadius,
    //     cornerRadius,
    //     cornerRadius,
    //     325,
    //   ),
    // },
    // center
    // {
    //   ...getCircleCoordinates(circleX0, circleY0, circleWidth / 2 - 5, 160),
    // },
    // {
    //   ...getCircleCoordinates(circleX0, circleY0, circleWidth / 2 - 6, 150),
    // },
    // {
    //   ...getCircleCoordinates(circleX0, circleY0, circleWidth / 2 - 7, 140),
    // },
    // {
    //   ...getCircleCoordinates(circleX0, circleY0, circleWidth / 2 - 8, 130),
    // },
    // {
    //   ...getCircleCoordinates(circleX0, circleY0, circleWidth / 2 - 9, 120),
    // },
    // {
    //   ...getCircleCoordinates(circleX0, circleY0, circleWidth / 2 - 10, 110),
    // },
    // {
    //   ...getCircleCoordinates(circleX0, circleY0, circleWidth / 2 - 11, 100),
    // },
    // {
    //   ...getCircleCoordinates(circleX0, circleY0, circleWidth / 2 - 12, 90),
    // },
    // {
    //   ...getCircleCoordinates(circleX0, circleY0, circleWidth / 2 - 11, 80),
    // },
    // {
    //   ...getCircleCoordinates(circleX0, circleY0, circleWidth / 2 - 10, 70),
    // },
    // {
    //   ...getCircleCoordinates(circleX0, circleY0, circleWidth / 2 - 9, 60),
    // },
    // {
    //   ...getCircleCoordinates(circleX0, circleY0, circleWidth / 2 - 8, 50),
    // },
    // {
    //   ...getCircleCoordinates(circleX0, circleY0, circleWidth / 2 - 7, 40),
    // },
    // {
    //   ...getCircleCoordinates(circleX0, circleY0, circleWidth / 2 - 6, 30),
    // },
    // {
    //   ...getCircleCoordinates(circleX0, circleY0, circleWidth / 2 - 5, 20),
    // },
    // right center corner
    // {
    //   ...getCircleCoordinates(
    //     circleX0 + circleWidth / 2 + cornerRadius,
    //     cornerRadius,
    //     cornerRadius,
    //     200,
    //   ),
    // },
    // {
    //   ...getCircleCoordinates(
    //     circleX0 + circleWidth / 2 + cornerRadius,
    //     cornerRadius,
    //     cornerRadius,
    //     220,
    //   ),
    // },
    // {
    //   ...getCircleCoordinates(
    //     circleX0 + circleWidth / 2 + cornerRadius,
    //     cornerRadius,
    //     cornerRadius,
    //     245,
    //   ),
    // },
  ]);
};
