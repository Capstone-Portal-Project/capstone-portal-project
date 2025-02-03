const getProjectProps = () => {
    const props = {
      hero: {
        title: "3D Tetris Using Augmented Reality",
        desc: `Augmented Reality combines the real-ness of AR with the synthetic-ness of VR. In the project, the real will be a plastic box. The
            synthetic will be a group of weirdly-shaped 3D objects that the user will attempt to fit in the box under the control of real 
            collision physics. This can be just a fun excercise, but feel free to turn it into a game with scoring, timing, etc.`,
      },
      content: { 
        textcontent:[
          {
            heading: "Objectives",
            text:
              "The deliverable is the interactive program, using a Quest 3, that allows the user to oprtimally fit the 3D objects" +
              "in the box. This can be just a fun excercise, but feel free to turn it into a game with scoring, timing, etc.",
          },
          {
            heading: "Motivations",
            text:
              "Augmented Reality is a hot technology used (among other things) to teach people how to assemble or fix objects, " +
              "such as automobile engines.  That is a perfect example that combines the real-ness of AR with the synthetic-ness of" +
              " VR.  We could do that, but why not do something cooler and funner?",
          },
          {
            heading: "Minimum Qualifications",
            text: "All students on this project must have taken, or currently be taking, CS 450. No Exceptions!",
          },
          {
            heading: "Preferred Qualifications",
            text: "None Listed",
          },
        ]
      },
      infoCard: {
        img: 'https://eecs.engineering.oregonstate.edu/capstone/submission/assets/img/capstone_test.jpg',
        desc: 'Blank placeholder text',
        details: {
          'Project Partner': 'Mike Bailey',
          'NDA/IPA': false,
          'Number of Groups': 1,
          'Project Status': true          
        },
        keywords: ["Gaming", "Augmented Reality (AR)", "New Product or Game"],
      },
    };

    return props;
}

export default getProjectProps;

  