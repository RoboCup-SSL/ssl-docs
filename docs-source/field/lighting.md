# Lighting

The rules do not specify lighting. These recommendations come from team and event experience.

- **Avoid fluorescent tubes and lights with low-frequency pulse width modulation dimming.** They flicker at tens to
  hundreds of hertz. At the few-millisecond exposures used for vision, each frame samples a different brightness, and
  rolling shutters show banding.
- **Diffuse your sources**, by spreading them across the ceiling or using diffusion panels. Illumination should be as
  homogeneous as possible across the field. A brightness gradient shifts the marker colors seen by the camera, so one
  color calibration no longer fits the whole image.
- **Avoid or minimize daylight.** Its variance forces continuous recalibration. Blackout curtains are usually enough.
- **Aim for color temperatures of 5000K to 6500K.** This range gives the best contrast between the marker colors and the
  orange ball. Warmer light lacks blue and narrows the separation.
- **High brightness is key.** It allows a short exposure, which reduces motion blur of fast robots and the ball.

Fix exposure, gain, and white balance in the camera and calibrate under the lighting you will play under. See
[software support](cameras.md#software-support-by-league-vision-software) on the camera page.
