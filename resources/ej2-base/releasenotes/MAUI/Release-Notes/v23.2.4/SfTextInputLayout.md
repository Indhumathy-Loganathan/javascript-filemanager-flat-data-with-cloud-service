## SfTextInputLayout

N> Manually input values don't update the Stroke Value due to an issue at the framework level in .NET 8.0. This problem arises because the manual value doesn't override an implicit style. However, you can resolve this by setting the Stroke Value using the Visual State Manager (VSM) through Style. Refer to this [link](https://github.com/dotnet/maui/issues/18103) for more details.