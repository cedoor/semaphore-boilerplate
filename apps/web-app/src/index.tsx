import { ChakraProvider, Container, HStack, Spinner, Stack, Text } from "@chakra-ui/react"
import detectEthereumProvider from "@metamask/detect-provider"
import { Identity } from "@semaphore-protocol/identity"
import { Contract, providers, Signer } from "ethers"
import { hexlify } from "ethers/lib/utils"
import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import Events from "../../contracts/build/contracts/contracts/Events.sol/Events.json"
import theme from "../styles"
import GroupStep from "./components/GroupStep"
import IdentityStep from "./components/IdentityStep"
import ProofStep from "./components/ProofStep"

function App() {
    const [_logs, setLogs] = useState<string>("")
    const [_step, setStep] = useState<number>(1)
    const [_identity, setIdentity] = useState<Identity>()
    const [_signer, setSigner] = useState<Signer>()
    const [_contract, setContract] = useState<Contract>()
    const [_event, setEvent] = useState<any>()

    useEffect(() => {
        ;(async () => {
            const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
            const ethereum = (await detectEthereumProvider()) as any
            const accounts = await ethereum.request({ method: "eth_requestAccounts" })

            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: hexlify(1337).replace("0x0", "0x")
                    }
                ]
            })

            const ethersProvider = new providers.Web3Provider(ethereum)

            if (accounts[0]) {
                setSigner(ethersProvider.getSigner())

                setContract(new Contract(contractAddress, Events.abi, ethersProvider.getSigner()))
            }

            ethereum.on("accountsChanged", (newAccounts: string[]) => {
                if (newAccounts.length !== 0) {
                    setSigner(ethersProvider.getSigner())

                    setContract(new Contract(contractAddress, Events.abi, ethersProvider.getSigner()))
                } else {
                    setSigner(undefined)
                }
            })
        })()
    }, [])

    return (
        <>
            <Container maxW="lg" flex="1" display="flex" alignItems="center">
                <Stack>
                    {_step === 1 ? (
                        <IdentityStep onChange={setIdentity} onLog={setLogs} onNextClick={() => setStep(2)} />
                    ) : _step === 2 ? (
                        <GroupStep
                            signer={_signer}
                            contract={_contract}
                            identity={_identity as Identity}
                            onPrevClick={() => setStep(1)}
                            onSelect={(event) => {
                                setEvent(event)
                                setStep(3)
                            }}
                            onLog={setLogs}
                        />
                    ) : (
                        <ProofStep
                            signer={_signer}
                            contract={_contract}
                            identity={_identity as Identity}
                            event={_event}
                            onPrevClick={() => setStep(2)}
                            onLog={setLogs}
                        />
                    )}
                </Stack>
            </Container>

            <HStack
                flexBasis="56px"
                borderTop="1px solid #8f9097"
                backgroundColor="#DAE0FF"
                align="center"
                spacing="4"
                p="4"
            >
                {_logs.endsWith("...") && <Spinner color="primary.400" />}
                <Text>{_logs || `Current step: ${_step}`}</Text>
            </HStack>
        </>
    )
}

const root = createRoot(document.getElementById("app")!)

root.render(
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>
)